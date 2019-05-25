import React from 'react';
import UptimeForm from './UptimeForm';
import './App.css';

const App: React.FC<{ sla?: number }> = () => {
  return (
    <div className="App">
      <h1>
        <b>UP71ME &amp; SLA CALC:</b>
      </h1>
      <UptimeForm></UptimeForm>
      <div className="App-bottom">
          rtfm: <a
            className="App-link"
            href="https://en.wikipedia.org/wiki/Uptime"
            target="_blank"
            rel="noopener noreferrer"
          >
            uptime
        </a> and <a
            className="App-link"
            href="https://en.wikipedia.org/wiki/Leet"
            target="_blank"
            rel="noopener noreferrer"
          >
            leetspeak
        </a>
        <p>Created by Ted Johnson messing around.</p>
        </div>
      </div>
      );
    }
    
    export default App;
