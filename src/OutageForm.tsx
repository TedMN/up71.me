import React, { FormEvent } from 'react';
import Moment from 'moment';
import { InputGroup, Form, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import Results from './Results';
import * as uptimeCalc from './uptimeCalc';
import Warning from './Warning';
import logEntry from './logEntry';

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
export default class OutageForm extends React.Component<OutageFormProps, any, any> {
  constructor(props: OutageFormProps) {
    super(props);
    
    //This feels like it could be better handled with two subclasses/conditional rendering of two small objects. May refactor when we go multi-lingual.
    const durationModes = {
      'Hours': { placeholder: 'Hours, ex: 1.5', warning: 'Must enter only a number, like 1.5 or 34.' },
      'Duration': { placeholder: 'ISO 8601 ex: PT1.5H', warning: 'Must enter a Duration per the ISO 8601 specifcation, PT4H or P2DT4H4M.' }
    };

    const selected = 'Hours';
    const other = 'Duration';

    this.state = {
      cursorFocus: false,
      day: '',
      week: '',
      month: '',
      year: '',
      leapYear: '',
      raw: '',
      warning: '',
      placeholder: durationModes[selected].placeholder,
      selected: selected,
      other: other,
      durationModes: durationModes
    };

    this.handleChange = this.handleChange.bind(this);
    this.createHandleChangeButton = this.createHandleChangeButton.bind(this);
  }

  //Will set the state back to where it started.
  clearRanges(): void {
    this.setState({
      day: '',
      week: '',
      month: '',
      year: '',
      leapYear: '',
      lastTimer: 0
    });
  }

  //Can handle multiple types, simply prevents default event bubbling from occuring further.
  preventEvent(event: FormEvent<HTMLFormElement> | Event) {
    event.preventDefault();
  }

  //Called whenever a change on the input requires handling and potentially updating the state.
  handleChange(event: any) {
    const value = event.target.value;
    
    this.setState({ raw: value });

    this.preventEvent(event);
    
    return this.state.selected === 'Hours' ? this.handleHoursChange(value) : this.handleDurationChange(value);
  }

  //Creates a function with a bound value so that it can be easily invoked.  The Button Dropdown is not saving the context very well.
  createHandleChangeButton(value : string) : () => void {
    const newOther = this.state.selected;
    const otherObj = this.state.durationModes[value];
    const placeholder = otherObj.placeholder;
    
    return () => {
      this.clearRanges();
      this.setState({
        raw: "",
        other: newOther,
        placeholder: placeholder,
        selected: value,
        warning: ""
      });
    };
  }

  handleHoursChange(value : string) {
    if(value !== ""){
      value = "PT" + value + "H";
    }
    
    this.handleDurationChange(value);
  }

  handleDurationChange(value : string) {
    const duration = Moment.duration(value);
    const isValid = duration.isValid() && duration.asMilliseconds() > 0;
    
    logEntry('outage', value, this.state.lastTimer, (i) => { this.setState({ lastTimer: i }) });

    if (value.length < 3) {
      this.setState({ warning: "" });
      this.clearRanges();
    } else if (!isValid) {
      this.setState({ warning: this.state.durationModes[this.state.selected].warning });
      this.clearRanges();
    } else {
      //is a valid change and update required
      this.setOutage(duration.asMilliseconds());
      this.setState({ warning: "" });
    }
  }

  //sets the state data for a given downtime ratio provided in the input param
  setOutage(ms: number): void {
    const convert = (num: number) => {
      const converted = (100-(100*num));
      return (converted > 0 ? converted.toFixed(4) : 0) + "%";
    }

    let newValues = {
      day: convert(ms/uptimeCalc.MILLISECONDS_IN_A_DAY),
      week: convert(ms/(uptimeCalc.MILLISECONDS_IN_A_DAY * 7)),
      month: convert(ms/uptimeCalc.MILLISECONDS_IN_A_MONTH),
      year: convert(ms/uptimeCalc.MILLISECONDS_IN_A_YEAR),
      leapYear: convert(ms/uptimeCalc.MILLISECONDS_IN_A_LEAPYEAR)
    };

    this.setState(newValues);
  }

  public render() {
    return (
      <Form onSubmit={this.preventEvent} >
        <InputGroup size="lg" className="mb-1">
          <FormControl
            placeholder={this.state.placeholder}
            aria-label={this.state.placeholder}
            aria-describedby="basic-addon2"
            className="UptimeInput" style={{ paddingRight: '2rem' }} name="uptime" autoComplete={"off"} autoFocus={this.state.cursorFocus} onChange={this.handleChange}
            isInvalid={this.state.warning}
            value={this.state.raw}
          />
          <DropdownButton
            as={InputGroup.Append}
            variant="outline-secondary"
            title={this.state.selected}
            id="input-group-dropdown-2">
            <Dropdown.Item key={this.state.other} href="#" onSelect={this.createHandleChangeButton(this.state.other)}>{this.state.other}</Dropdown.Item>
          </DropdownButton>
        </InputGroup>
        {Warning(this.state.warning)}
        <Results state={this.state} title="Matching SLA %"/>
      </Form>
    );
  }
}
