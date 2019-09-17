import React from 'react';
import { Alert } from 'react-bootstrap';

//Warning conditional display
function Warning(warning: string) {
    return warning ? (<Alert variant="danger">{warning}</Alert>) : ("");
  }

export default Warning;