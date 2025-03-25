import React from 'react';
import PropTypes from 'prop-types';
import UnifiedLabAndTestObservationDetail from './UnifiedLabAndTestObservationDetail';

const UnifiedLabAndTestObservations = props => {
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
              <UnifiedLabAndTestObservationDetail
                header="Result"
                value={result.value.text}
                ddActionName="[lab and tests - result]"
              />
              <UnifiedLabAndTestObservationDetail
                header="Reference range"
                value={result.referenceRange}
                ddActionName="[lab and tests - reference range]"
              />
              <UnifiedLabAndTestObservationDetail
                header="Status"
                value={result.status}
                ddActionName="[lab and tests - status]"
              />
              {result.bodySite && (
                <UnifiedLabAndTestObservationDetail
                  header="Body site"
                  value={result.bodySite}
                  ddActionName="[lab and tests - body site]"
                />
              )}
              {result.sampleTested && (
                <UnifiedLabAndTestObservationDetail
                  header="Sample tested"
                  value={result.sampleTested}
                  ddActionName="[lab and tests - sample tested]"
                />
              )}
              {result.comments && (
                <UnifiedLabAndTestObservationDetail
                  header="Comments"
                  value={result.comments}
                  ddActionName="[lab and tests - comments]"
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default UnifiedLabAndTestObservations;

UnifiedLabAndTestObservations.propTypes = {
  results: PropTypes.array,
};
