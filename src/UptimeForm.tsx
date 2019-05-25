import React from 'react';
import Moment from 'moment';

export const MILLISECONDS_IN_A_DAY = 86400 * 1000;
export const MILLISECONDS_IN_A_YEAR = 365 * MILLISECONDS_IN_A_DAY;
export const MILLISECONDS_IN_A_LEAPYEAR = 366 * MILLISECONDS_IN_A_DAY;
export const MILLISECONDS_IN_A_MONTH = 30 * MILLISECONDS_IN_A_DAY;

//Just tries to force the format to be less permisive than parseFloat which is very forgiving.
const REGEX_FORMAT = /^[0-9]*\.?[0-9]*$/;

//Simple check that it is a percent0to100
function isPercent(str : string) : boolean {
  const number = parseFloat(str);
  console.log(number);
  return (!isNaN(number) && (number <= 100) && (number >= 0)) ? true : false;
}

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

    clearDowntimes() : void {
      this.setState({
        day: '',
        week: '',
        month: '',
        year: '',
        leapYear: ''
      });
    }

    preventEvent(event : any) {
      event.preventDefault();
    }

    handleChange(event : any) {
      const value = event.target.value;

      event.preventDefault();

      if(value.length === 0) {
        this.setState({warning: ""});
        this.clearDowntimes();
      } else if(!REGEX_FORMAT.test(value) || !isPercent(value)) {
        this.setState({warning: "A percent for uptime needs to from 0 to 100. ex: 99.95"});
        this.clearDowntimes();

      } else {
        const percent = parseFloat(value);
        console.log(percent);
        this.setDowntime(percent === 100 ? 0 : ((100-percent)/100));
        this.setState({warning: ""});
      }
      this.setState({raw: value});
    }

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
        <form onSubmit={this.preventEvent}>
          <label>
            Enter the expected uptime percent <input type="text" className="UptimeInput" name="uptime" autoComplete={"off"} autoFocus={true} onChange={this.handleChange} /> %<br/>
            {this.state.warning}
          </label>
          <div hidden={this.state.year === ''}>
            <h3>Year: {this.state.year}</h3><br/>
            <p>
            Month: {this.state.month} <br/>
            Week: {this.state.week} <br/>
            Day: {this.state.day} <br/>
            </p>
          </div>
        </form>
      );
    }
  }
