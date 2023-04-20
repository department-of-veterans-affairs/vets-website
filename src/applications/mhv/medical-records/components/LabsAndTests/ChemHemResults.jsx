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
              <p>{result.result}</p>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                Standard range
              </h4>
              <p>{result.standardRange}</p>
              <va-additional-info trigger="What's the standard range?">
                The standard range is one tool your providers use to understand
                your results. If your results are outside the standard range,
                this doesn’t automatically mean you have a health problem. Your
                provider will explain what your results mean for your health.
              </va-additional-info>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                Status
              </h4>
              <p>{result.status}</p>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                Lab location
              </h4>
              <p>{result.labLocation}</p>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                Interpretation
              </h4>
              <p>{result.interpretation}</p>
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
