import React from 'react';
import PropTypes from 'prop-types';

const UnifiedLabAndTestObservation = props => {
  const { results } = props;
  return (
    <ul className="result-cards">
      {results.map((result, idx) => {
        return (
          <li key={idx}>
            <h3
              className="vads-u-margin--0 vads-u-padding--2"
              data-dd-privacy="mask"
              data-dd-action-name="[lab and tests - result name]"
            >
              {result.testCode}
            </h3>
            <div className="vads-u-padding-x--3 vads-u-padding-top--2">
              <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0">
                Result
              </h4>
              <p
                className="vads-u-margin--0 vads-u-padding-bottom--2"
                data-dd-privacy="mask"
                data-dd-action-name="[lab and tests - result]"
              >
                {result.value.text}
              </p>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0">
                Reference range
              </h4>
              <p
                className="vads-u-margin--0 vads-u-padding-bottom--2"
                data-dd-privacy="mask"
                data-dd-action-name="[lab and tests - reference range]"
              >
                {result.referenceRange}
              </p>
              <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0">
                Status
              </h4>
              <p
                className="vads-u-margin--0 vads-u-padding-bottom--2"
                data-dd-privacy="mask"
                data-dd-action-name="[lab and tests - status]"
              >
                {result.status}
              </p>
              {result.labComments && (
                <>
                  <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0">
                    Lab comments
                  </h4>
                  <p
                    className="vads-u-margin--0 vads-u-padding-bottom--2"
                    data-dd-privacy="mask"
                    data-dd-action-name="[lab and tests - lab comments]"
                  >
                    {result.labComments}
                  </p>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default UnifiedLabAndTestObservation;

UnifiedLabAndTestObservation.propTypes = {
  results: PropTypes.array,
};
