import React, { FormEvent, useState } from 'react';
import { InputGroup, Form, FormControl } from 'react-bootstrap';
import Results from './Results';
import * as uptimeCalc from './uptimeCalc';
import Warning from './Warning';
import logEntry from './logEntry';
import Durations from './model/Durations';

declare var gtag: UniversalAnalytics.ga;

//Just tries to force the format to be less permisive than parseFloat which is very forgiving.
const REGEX_FORMAT = /^[0-9]*\.?[0-9]*$/;


/**
 * React component to render the form and output for downtime calculations
 * Input of 99.99 to "year | 5 minutes and 10 seconds" table view.
 */
//export default class UptimeForm extends React.Component<any, any, any> {
export default function UptimeForm(props: {durations?: Durations | null}) {
  const [durations, setDurations] = useState<Durations | null>(props.durations ? props.durations : null);
  const [warning, setWarning] = useState("");
  const [lastTimer, setLastTimer] = useState(0);
  const [, setRaw] = useState(0);
  const [cursorFocus, ] = useState(true);

  //Can handle multiple types, simply prevents default event bubbling from occuring further.
  function preventEvent(event: FormEvent<HTMLFormElement> | Event) {
    event.preventDefault();
  }

  //Called whenever a change on the input requires handling and potentially updating the state.
  function handleChange(event: any) {
    const value = event.target.value;
    const isValid = event.target.validity.valid;
    const message = "A percent for uptime needs to from 0 to 100. ex: 99.95";

    preventEvent(event);

    setWarning("");
    setRaw(value);

    if (value.length > 0) {
      logEntry('uptime', value, lastTimer, (i) => { setLastTimer(i) });
    } else {
      clearTimeout(lastTimer);
    }

    if (!isValid) {
      setWarning(message);
      setDurations(null);
    } else if (value.length === 0) {
      setWarning("");
      setDurations(null);
    } else if (!REGEX_FORMAT.test(value) || !uptimeCalc.is0to100(value)) {
      setWarning(message);
      setDurations(null);
    } else {
      //is a valid change and update required
      const percent = parseFloat(value);
      setDowntime(percent === 100 ? 0 : ((100 - percent) / 100));
    }
  }

  //sets the state data for a given downtime ratio provided in the input param
  function setDowntime(ratio: number): void {
    const smooth = (num: number) => Math.round(num);
    const durationReadable = uptimeCalc.durationReadable;
    const day23Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_HOUR * 23),
      day24Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_HOUR * 24),
      day25Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_HOUR * 25),
      week167Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_HOUR * 167),
      week168Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_HOUR * 168),
      week169Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_HOUR * 169),
      month28Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_DAY * 28),
      month29Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_DAY * 29),
      month30Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_DAY * 30),
      month31Ms = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_DAY * 31),
      yearMs = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_YEAR),
      leapYearMs = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_LEAPYEAR)

    setDurations({
      day23: durationReadable(day23Ms),
      day24: durationReadable(day24Ms),
      day25: durationReadable(day25Ms),
      week167: durationReadable(week167Ms),
      week168: durationReadable(week168Ms),
      week169: durationReadable(week169Ms),
      month28: durationReadable(month28Ms),
      month29: durationReadable(month29Ms),
      month30: durationReadable(month30Ms),
      month31: durationReadable(month31Ms),
      year: durationReadable(yearMs),
      leapYear: durationReadable(leapYearMs)
    });
  }

  return (
    <Form onSubmit={preventEvent} >
      <InputGroup className="mb-1" size="lg">
        <FormControl
          placeholder="SLA percent (ex: 99.95)"
          aria-label="SLA percent"
          aria-describedby="basic-addon2"
          type="number"
          step="any"
          className="UptimeInput" style={{ paddingRight: '2rem' }}
          name="uptime" autoComplete={"off"}
          autoFocus={cursorFocus}
          onInput={handleChange}
          isInvalid={warning ? true : false}
        />
        <InputGroup.Append>
          <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
      {Warning(warning)}
      <Results durations={durations} title="Downtime"/>
    </Form>
  );
}
