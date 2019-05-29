import React, { FormEvent } from 'react';
import Moment from 'moment';
import { InputGroup, Form, FormControl, Alert } from 'react-bootstrap';
import Results from './Results';

export const MILLISECONDS_IN_A_DAY = 86400 * 1000;
export const MILLISECONDS_IN_A_YEAR = 365 * MILLISECONDS_IN_A_DAY;
export const MILLISECONDS_IN_A_LEAPYEAR = 366 * MILLISECONDS_IN_A_DAY;
export const MILLISECONDS_IN_A_MONTH = 30 * MILLISECONDS_IN_A_DAY;

//Just tries to force the format to be less permisive than parseFloat which is very forgiving.
const REGEX_FORMAT = /^[0-9]*\.?[0-9]*$/;

//Simple check that it is a percent0to100
function is0to100(str : string) : boolean {
  const number = parseFloat(str);
  return (!isNaN(number) && (number <= 100) && (number >= 0)) ? true : false;
}

//Warning conditional display
function Warning(warning : string) {
  return warning ? (<Alert variant="danger">{warning}</Alert>) : ("");
}

//Converts a number to a readable string
function durationReadable(ms : number) : string {
  const dur = Moment.duration(ms);
  const month = dur.get('months');
  const d = dur.get('d');
  const h = dur.get('h');
  const min = dur.get('m');
  const s = dur.get('s');
  const mills = dur.get('ms');

  let arr : string[] = [];
  if(month>0) arr.push(`${month} month${month > 1?'s':''}`);
  if(d>0) arr.push(`${d} day${d > 1?'s':''}`);
  if(h>0) arr.push(`${h} hour${h > 1?'s':''}`);
  if(min>0) arr.push(`${min} minute${min > 1?'s':''}`);
  if(s>0) arr.push(`${s} second${s > 1?'s':''}`);

  if(arr.length === 0){
    if(mills>50){
      arr.push(`${mills} milliseconds`);
    } else {
      arr.push('~0');
    }
  }

  return arr.join(', ');
}

/**
 * React component to render the form and output for downtime calculations
 */
export default class UptimeForm extends React.Component<any, any, any> {
    constructor(props : any) {
      super(props);
      this.state = {
        day: '',
        week: '',
        month: '',
        year: '',
        leapYear: '',
        raw: '',
        warning: ''
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

      this.preventEvent(event);

      if(value.length === 0) {
        this.setState({warning: ""});
        this.clearDowntimes();
      } else if(!REGEX_FORMAT.test(value) || !is0to100(value)) {
        this.setState({warning: "A percent for uptime needs to from 0 to 100. ex: 99.95"});
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

      const dayMs = smooth(ratio * MILLISECONDS_IN_A_DAY),
        weekMs = smooth(ratio * MILLISECONDS_IN_A_DAY * 7),
        monthMs = smooth(ratio * MILLISECONDS_IN_A_MONTH),
        yearMs = smooth(ratio * MILLISECONDS_IN_A_YEAR),
        leapYearMs = smooth(ratio * MILLISECONDS_IN_A_LEAPYEAR)

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
                placeholder="Service level percentage (ex: 99.95)"
                aria-label="Service level percentage"
                aria-describedby="basic-addon2"
                className="UptimeInput" style={{paddingRight: '2rem'}} name="uptime" autoComplete={"off"} autoFocus={true} onChange={this.handleChange}
                isInvalid={this.state.warning}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {Warning(this.state.warning)}
            <Results state={this.state} title="Downtime Breach"/>
        </Form>
      );
    }
  }
