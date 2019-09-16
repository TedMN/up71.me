import Moment from 'moment';

export const MILLISECONDS_IN_A_DAY = 86400 * 1000;
export const MILLISECONDS_IN_A_YEAR = 365 * MILLISECONDS_IN_A_DAY;
export const MILLISECONDS_IN_A_LEAPYEAR = 366 * MILLISECONDS_IN_A_DAY;
export const MILLISECONDS_IN_A_MONTH = 30 * MILLISECONDS_IN_A_DAY;

//Simple check that it is a percent0to100
export function is0to100(str : string) : boolean {
    const number = parseFloat(str);
    return (!isNaN(number) && (number <= 100) && (number >= 0)) ? true : false;
}

//Converts a number to a readable string
export function durationReadable(ms : number) : string {
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
