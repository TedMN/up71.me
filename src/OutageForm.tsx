import React, { FormEvent, useState } from 'react';
import Moment from 'moment';
import { InputGroup, Form, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import Results from './Results';
import * as uptimeCalc from './uptimeCalc';
import Warning from './Warning';
import logEntry from './logEntry';
import Durations from './model/Durations';

export enum OutageFormTypeEnum {
  HOURS,
  DURATION
}

export interface OutageFormProps {
  initialValue?: { value: string, type: OutageFormTypeEnum }
}

/**
 * React component to render the form and output for outage calculations
 * Input hours or duration and get back SLA %, ex. 99.945
 */
export default function OutageForm(props: OutageFormProps) {
  
  interface DurationMode {
    placeholder: string,
    warning: string
  }

  const durationModes: { [key: string]: DurationMode } = {
    Hours: { placeholder: 'Hours, ex: 1.5', warning: 'Must enter only a number, like 1.5 or 34.' },
    Duration: { placeholder: 'ISO 8601 ex: PT1.5H', warning: 'Must enter a Duration per the ISO 8601 specifcation, PT4H or P2DT4H4M.' }
  };

  const cursorFocus = false;
  const [durations, setDurations] = useState<Durations | null>(null);
  const [warning, setWarning] = useState('');
  const [selected, setSelected] = useState('Hours');
  const [other, setOther] = useState('Duration');
  const [placeholder, setPlaceholder] = useState(durationModes[selected].placeholder);
  const [lastTimer, setLastTimer] = useState(0);
  const [raw, setRaw] = useState('');

  //Called whenever a change on the input requires handling and potentially updating the state.
  function handleChange(event: any) {
    const value = event.target.value;

    event.preventDefault();

    setRaw(value);

    return selected === 'Hours' ? handleHoursChange(value) : handleDurationChange(value);
  }

  //Can handle multiple types, simply prevents default event bubbling from occuring further.
  function preventEvent(event: FormEvent<HTMLFormElement> | Event) {
    event.preventDefault();
  }

  //Creates a function with a bound value so that it can be easily invoked.  The Button Dropdown is not saving the context very well.
  function createHandleChangeButton(value: string): () => void {
    const newOther = selected;
    const otherObj = durationModes[value];
    const placeholder = otherObj.placeholder;

    return () => {
      setOther(newOther);
      setSelected(value);
      setWarning('');
      setPlaceholder(placeholder);
      setRaw('');
      setDurations(null);
    };
  }

  function handleHoursChange(value: string) {
    if (value !== "") {
      value = "PT" + value + "H";
    }

    handleDurationChange(value);
  }

  function handleDurationChange(value: string) {
    const duration = Moment.duration(value);
    const isValid = duration.isValid() && duration.asMilliseconds() > 0;

    logEntry('outage', value, lastTimer, (i) => { setLastTimer(i); });

    if (value.length < 3) {
      setWarning("");
      setDurations(null);
    } else if (!isValid) {
      setWarning(durationModes[selected].warning );
      setDurations(null);
    } else {
      //is a valid change and update required
      setOutage(duration.asMilliseconds());
      setWarning("");
    }
  }

  //sets the state data for a given downtime ratio provided in the input param
  function setOutage(ms: number): void {
    const convert = (num: number) => {
      const converted = (100 - (100 * num));
      return (converted > 0 ? converted.toFixed(4) : 0) + "%";
    }

    setDurations({
      day23: convert(ms / (uptimeCalc.MILLISECONDS_IN_A_HOUR * 23)),
      day24: convert(ms / uptimeCalc.MILLISECONDS_IN_A_DAY),
      day25: convert(ms / (uptimeCalc.MILLISECONDS_IN_A_HOUR * 25)),
      week167: convert(ms / (uptimeCalc.MILLISECONDS_IN_A_HOUR * 167)),
      week168: convert(ms / (uptimeCalc.MILLISECONDS_IN_A_HOUR * 168)),
      week169: convert(ms / (uptimeCalc.MILLISECONDS_IN_A_HOUR * 169)),
      month28: convert(ms / (uptimeCalc.MILLISECONDS_IN_A_DAY * 28)),
      month29: convert(ms / (uptimeCalc.MILLISECONDS_IN_A_DAY * 29)),
      month30: convert(ms / (uptimeCalc.MILLISECONDS_IN_A_DAY * 30)),
      month31: convert(ms / (uptimeCalc.MILLISECONDS_IN_A_DAY * 31)),
      year: convert(ms / uptimeCalc.MILLISECONDS_IN_A_YEAR),
      leapYear: convert(ms / uptimeCalc.MILLISECONDS_IN_A_LEAPYEAR)
    });
  }

  return (
    <Form onSubmit={preventEvent} >
      <InputGroup size="lg" className="mb-1">
        <FormControl
          placeholder={placeholder}
          aria-label={placeholder}
          aria-describedby="basic-addon2"
          className="UptimeInput" style={{ paddingRight: '2rem' }} name="uptime" autoComplete={"off"} autoFocus={cursorFocus} onChange={handleChange}
          isInvalid={warning ? true : false}
          value={raw}
        />
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-secondary"
          title={selected}
          id="input-group-dropdown-2">
          <Dropdown.Item key={other} href="#" onSelect={createHandleChangeButton(other)}>{other}</Dropdown.Item>
        </DropdownButton>
      </InputGroup>
      {Warning(warning)}
      <Results durations={durations} title="Matching SLA %" />
    </Form>
  );
}
