import React from 'react';
import { Table } from 'react-bootstrap';

export default function Results(props : { state: any, title: string }) {
    const state = props.state;
    const isHidden : boolean = state === undefined || state.year === null || state.year === "";
    return (
    <div hidden={isHidden} className="App-result">
    <h4><b>{props.title}</b></h4>
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Year</td>
          <td>{state.year}</td>
        </tr>
        <tr>
          <td>Month</td>
          <td>{state.month}</td>
        </tr>
        <tr>
          <td>Week</td>
          <td>{state.week}</td>
        </tr>
        <tr>
          <td>Day</td>
          <td>{state.day}</td>
        </tr>
      </tbody>
    </Table>
  </div>);
  }