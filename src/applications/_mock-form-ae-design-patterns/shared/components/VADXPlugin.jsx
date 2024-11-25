import React from 'react';
import { Link } from 'react-router';

export const VADXPlugin = () => {
  return (
    <div>
      <p>VADX Plugin</p>
      <p>
        <Link to="/mock-form-ae-design-patterns/1">Pattern 1</Link>
      </p>
      <p>
        <Link to="/mock-form-ae-design-patterns/2">Pattern 2</Link>
      </p>
    </div>
  );
};
