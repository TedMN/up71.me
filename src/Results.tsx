import React from 'react';
import { Table } from 'react-bootstrap';
import Durations from './model/Durations';

export default function Results(props: { durations: Durations | null, title: string}) {
  const { durations, title } = props;
  
  const results : [string,string][] = durations ? [
    ["Year", durations.year],
    ["Month", durations.month30],
    ["Week", durations.week168],
    ["Day", durations.day24]
  ] : [];
  const detailed : [string,string][] = durations ? [
    ["Leap Year", durations.leapYear],
    ["Month 28 days - Feb", durations.month28],
    ["Month 29 days- Leap Year Feb", durations.month29],
    ["Month 30 days - Apr, Jun, Sep, Nov", durations.month30],
    ["Month 31 days - Jan, Mar, May, Jul, Aug, Oct, Dec", durations.month31],
    ["Week (Spring forward)", durations.week167],
    ["Week (Fall back)", durations.week169],
    ["Day (Spring forward)", durations.day23],
    ["Day (Fall back)", durations.day25]
  ] : [];

  function ResultsTable(props: {labelValuePair: [string, string][], size?: string}) {
    const TRs = props.labelValuePair.map((pair) => { 
      return (
      <tr>
        <td>{pair[0]}</td>
        <td>{pair[1]}</td>
      </tr>); 
    });

    return (
      <Table striped bordered hover responsive size={props.size}>
          <tbody>
            {TRs}
          </tbody>
        </Table>
    );
  }

  if (durations === null) {
    return (<div></div>);
  }
  else 
  {
    return (
      <div className="App-result">
        <h4><b>{title}</b></h4>
        <ResultsTable labelValuePair={results}></ResultsTable>
        <h5><b>Additional Details</b></h5>
        <ResultsTable labelValuePair={detailed} size="sm"></ResultsTable>
        
      </div>);
  }
}