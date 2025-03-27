import React, { useState } from 'react';
import { Button, Form, InputGroup, FormControl } from 'react-bootstrap';

const CompoundSLAForm: React.FC = () => {
  const [slaComponents, setSlaComponents] = useState([{ uptime: 99.9, weight: 1 }]);
  const [compoundSla, setCompoundSla] = useState(0);

  const handleComponentChange = (index: number, field: string, value: number) => {
    const updatedComponents = [...slaComponents];
    updatedComponents[index][field] = value;
    setSlaComponents(updatedComponents);
  };

  const addComponent = () => {
    setSlaComponents([...slaComponents, { uptime: 99.9, weight: 1 }]);
  };

  const calculateCompoundSLA = () => {
    const totalWeight = slaComponents.reduce((total, component) => total + component.weight, 0);
    const weightedSla = slaComponents.reduce(
      (total, component) => total + (component.uptime / 100) * component.weight,
      0
    );
    setCompoundSla((weightedSla / totalWeight) * 100);
  };

  return (
    <div>
      <h3>Compound SLA Calculator</h3>
      {slaComponents.map((component, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <h5>Component {index + 1}</h5>
          <InputGroup>
            <InputGroup.Text>Uptime (%)</InputGroup.Text>
            <FormControl
              type="number"
              value={component.uptime}
              onChange={(e) => handleComponentChange(index, 'uptime', parseFloat(e.target.value))}
            />
            <InputGroup.Text>Weight</InputGroup.Text>
            <FormControl
              type="number"
              value={component.weight}
              onChange={(e) => handleComponentChange(index, 'weight', parseFloat(e.target.value))}
            />
          </InputGroup>
        </div>
      ))}
      <Button variant="secondary" onClick={addComponent}>Add Component</Button>
      <Button variant="primary" onClick={calculateCompoundSLA} style={{ marginLeft: '10px' }}>
        Calculate Compound SLA
      </Button>
      {compoundSla > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Compound SLA: {compoundSla.toFixed(2)}%</h4>
        </div>
      )}
    </div>
  );
};

export default CompoundSLAForm;
