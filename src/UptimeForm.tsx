import React, { FormEvent } from 'react';
import { InputGroup, Form, FormControl } from 'react-bootstrap';
import Results from './Results';
import * as uptimeCalc from './uptimeCalc';
import Warning from './Warning';
import logEntry from './logEntry';

declare var gtag: UniversalAnalytics.ga;

//Just tries to force the format to be less permisive than parseFloat which is very forgiving.
const REGEX_FORMAT = /^[0-9]*\.?[0-9]*$/;

/**
 * React component to render the form and output for downtime calculations
 * Input of 99.99 to "year | 5 minutes and 10 seconds" table view.
 */
export default class UptimeForm extends React.Component<any, any, any> {
    constructor(props : any) {
      super(props);
      this.state = {
        cursorFocus: true,
        day: '',
        week: '',
        month: '',
        year: '',
        leapYear: '',
        raw: '',
        warning: '',
        lastTimer: 0
      };
  
      this.handleChange = this.handleChange.bind(this);
    }

    //Will set the state back to where it started.
    clearDowntimes() : void {
      this.setState({
        day: '',
        week: '',
        month: '',
        year: '',
        leapYear: ''
      });
    }

    //Can handle multiple types, simply prevents default event bubbling from occuring further.
    preventEvent(event : FormEvent<HTMLFormElement> | Event) {
      event.preventDefault();
    }

    //Called whenever a change on the input requires handling and potentially updating the state.
    handleChange(event : any) {
      const value = event.target.value;
      const isValid = event.target.validity.valid;
      const message = "A percent for uptime needs to from 0 to 100. ex: 99.95";

      this.preventEvent(event);

      if(value.length > 0){ 
        logEntry('uptime', value, this.state.lastTimer, (i) => { this.setState({ lastTimer: i })}); 
      } else {
        clearTimeout(this.state.lastTimer);
      }

      if(!isValid) {
        this.setState({warning: message});
        this.clearDowntimes();
      } else if(value.length === 0) {
        this.setState({warning: ""});
        this.clearDowntimes();
      } else if(!REGEX_FORMAT.test(value) || !uptimeCalc.is0to100(value)) {
        this.setState({warning: message});
        this.clearDowntimes();
      } else {
        //is a valid change and update required
        const percent = parseFloat(value);
        this.setDowntime(percent === 100 ? 0 : ((100-percent)/100));
        this.setState({warning: ""});
      }
      this.setState({raw: value});
    }

    //sets the state data for a given downtime ratio provided in the input param
    setDowntime(ratio : number) : void {
      const smooth = (num : number ) => Math.round(num);
      const durationReadable = uptimeCalc.durationReadable;
      const dayMs = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_DAY),
        weekMs = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_DAY * 7),
        monthMs = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_MONTH),
        yearMs = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_YEAR),
        leapYearMs = smooth(ratio * uptimeCalc.MILLISECONDS_IN_A_LEAPYEAR)

      let newValues = {
        day: durationReadable(dayMs),
        week: durationReadable(weekMs),
        month: durationReadable(monthMs),
        year: durationReadable(yearMs),
        leapYear:durationReadable(leapYearMs)
      };

      this.setState(newValues);
    }

    public render() {
      return (
        <Form onSubmit={this.preventEvent} >
              <InputGroup className="mb-1" size="lg">
              <FormControl
                placeholder="SLA percent (ex: 99.95)"
                aria-label="SLA percent"
                aria-describedby="basic-addon2"
                type="number"
                step="any"
                className="UptimeInput" style={{paddingRight: '2rem'}} 
                name="uptime" autoComplete={"off"} 
                autoFocus={this.state.cursorFocus} 
                onInput={this.handleChange}
                isInvalid={this.state.warning}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {Warning(this.state.warning)}
            <Results state={this.state} title="Downtime"/>
        </Form>
      );
    }
  }
