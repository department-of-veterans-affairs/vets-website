import React from 'react';
import PropTypes from 'prop-types';
import UnifiedLabAndTestObservationDetail from './UnifiedLabAndTestObservationDetail';
import { OBSERVATION_DISPLAY_LABELS } from '../../util/constants';

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
                header={OBSERVATION_DISPLAY_LABELS.VALUE}
                value={result.value.text}
                ddActionName="[lab and tests - result]"
              />
              <UnifiedLabAndTestObservationDetail
                header={OBSERVATION_DISPLAY_LABELS.REFERENCE_RANGE}
                value={result.referenceRange}
                ddActionName="[lab and tests - reference range]"
              />
              <UnifiedLabAndTestObservationDetail
                header={OBSERVATION_DISPLAY_LABELS.STATUS}
                value={result.status}
                ddActionName="[lab and tests - status]"
              />
              <UnifiedLabAndTestObservationDetail
                header={OBSERVATION_DISPLAY_LABELS.BODY_SITE}
                value={result.bodySite}
                ddActionName="[lab and tests - body site]"
              />
              <UnifiedLabAndTestObservationDetail
                header={OBSERVATION_DISPLAY_LABELS.SAMPLE_TESTED}
                value={result.sampleTested}
                ddActionName="[lab and tests - sample tested]"
              />
              <UnifiedLabAndTestObservationDetail
                header={OBSERVATION_DISPLAY_LABELS.COMMENTS}
                value={result.comments}
                ddActionName="[lab and tests - comments]"
              />
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
