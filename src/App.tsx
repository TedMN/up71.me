import React from 'react';
import UptimeForm from './UptimeForm';
import OutageForm from './OutageForm';
import './App.css';
import { Container, Row, Col, Card } from 'react-bootstrap';

const App: React.FC<{ uptime?: number, downtime?: string }> = () => {
  return (
    <div className="App">
      <Container fluid={true}>
        <Row>
          <Col sm="12" lg="6" md="12" xl="4" className="App-main">
            <label>
              <h2>SLA% -&gt; Downtime</h2>
              <h6>Convert Service Level Agreement to downtime duration.</h6>
            </label>
            <UptimeForm></UptimeForm>    
          </Col>
          <Col sm="12" lg="6" md="12" xl="5" className="App-main">
            <label>
              <h2>Downtime -&gt; SLA%</h2>
              <h6>Convert downtime duration to Service Level Agreement percent.</h6>
            </label>
            <OutageForm></OutageForm>
          </Col>
          
          <Col lg="12" md="12" xl="3" className="App-notes">
            <h2><b>UP71.ME (uptime)</b></h2>
            <Card>
              <Card.Body>
                UP71.ME (uptime) is a simple site for uptime, SLA, and downtime calcuations.  It's goal is to be fast, usable, and clear.<br/>
              Created by <a
                className="App-link"
                href="https://www.linkedin.com/in/johnsontedm"
                target="_blank"
                rel="noopener noreferrer">Ted Johnson</a> messing around.
              </Card.Body>
            </Card>
            <br/>
            <Card>
              <Card.Body>
                <Card.Title>Terminology</Card.Title>
                <Card.Text>For those with questions about the terminology or standards such as uptime, ISO 8601, or leet speak please R.T.F.M. in the links below.</Card.Text>
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
                href="https://en.wikipedia.org/wiki/High_availability"
                target="_blank"
                rel="noopener noreferrer">HA</Card.Link>
                <Card.Link className="App-link"
                href="https://en.wikipedia.org/wiki/ISO_8601"
                target="_blank"
                rel="noopener noreferrer">ISO 8601</Card.Link>
              </Card.Body>
            </Card>
            <br/>
            <Card>
              <Card.Body>
                <Card.Title>Project Links</Card.Title>
                <Card.Link className="App-link" href="https://github.com/TedMN/up71.me" target="_blank">
                  <img alt="Github project link" src="GitHub-Mark-32px.png"/> UP71.ME project
                </Card.Link>
                <br/><br/>
                <Card.Link className="App-link" href="https://twitter.com/intent/tweet?url=https://up71.me/&text=@TedMN Feedback or suggestion&hashtags=sla,up71.me,uptime" target="_blank">
                  <img alt="Twitter" src="Twitter_Social_Icon_Circle_Color.svg" width="32px" height="32px"/> Feedback or mention
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
