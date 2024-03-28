import React from 'react';
import PropTypes from 'prop-types';

const ChemHemResults = props => {
  const { results } = props;

  return (
    <ul className="result-cards">
      {results.map((result, idx) => {
        return (
          <li key={idx}>
            <h3>{result.name}</h3>
            <div>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                Result
              </h4>
              <p className="data">{result.result}</p>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                Standard range
              </h4>
              <p className="range">{result.standardRange}</p>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                Status
              </h4>
              <p className="data">{result.status}</p>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                Lab location
              </h4>
              <p className="data">{result.labLocation}</p>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                Interpretation
              </h4>
              <p className="data">{result.interpretation}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ChemHemResults;

ChemHemResults.propTypes = {
  results: PropTypes.array,
};
