import React from 'react';
import { Link } from 'react-router-dom';

const Results = () => {
  return (
    <div>
      <h2>Results</h2>
      <p>Outcome details would be displayed here.</p>
      <Link to="/debt-help-options/introduction">Start Over</Link>
    </div>
  );
};

export default Results;
