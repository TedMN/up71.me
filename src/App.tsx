import React from 'react';
import UptimeForm from './UptimeForm';
import OutageForm from './OutageForm';
import './App.css';
import { Container, Row, Col, Card } from 'react-bootstrap';

const App: React.FC<{ sla?: number }> = () => {
  return (
    <div className="App">
      <Container fluid={true}>
        <Row>
          <Col sm="12" lg="6" md="12" xl="4" className="App-main">
            <h2>SLA% -&gt; Downtime</h2>
            <UptimeForm></UptimeForm>    
          </Col>
          <Col sm="12" lg="6" md="12" xl="5" className="App-main">
            <h2>Downtime -&gt; SLA%</h2>
            <OutageForm></OutageForm>
          </Col>
          
          <Col lg="12" md="12" xl="3" className="App-notes">
            <h1><b>UP71.ME</b></h1>
            <Card>
              <Card.Body>
                UP71.ME is a simple site for uptime, SLA, and downtime calcuations.  It's goal is to be fast, usable, and clear.<br/>
              Created by <a
                className="App-link"
                href="https://www.linkedin.com/in/johnsontedm"
                target="_blank"
                rel="noopener noreferrer"
              >Ted Johnson</a> messing around.
              </Card.Body>
            </Card>
            <br/>
            <Card>
              <Card.Body>
                <Card.Text>For those with questions about uptime, ISO 8601, or leet speak please R.T.F.M. in the links below.</Card.Text>
                <Card.Link className="App-link"
                href="https://en.wikipedia.org/wiki/Uptime"
                target="_blank"
                rel="noopener noreferrer">Uptime</Card.Link>
                <Card.Link className="App-link"
                href="https://en.wikipedia.org/wiki/Leet"
                target="_blank"
                rel="noopener noreferrer">Leet</Card.Link>
                <Card.Link className="App-link"
                href="https://en.wikipedia.org/wiki/RTFM"
                target="_blank"
                rel="noopener noreferrer">RTFM</Card.Link>
                <Card.Link className="App-link"
                href="https://en.wikipedia.org/wiki/ISO_8601"
                target="_blank"
                rel="noopener noreferrer">ISO 8601</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
