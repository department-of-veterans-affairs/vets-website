import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  VaButton,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SUBTASK_FLOW } from '../subtasks';

const Results = ({ router, params }) => {
  const { outcomeId } = params;
  let foundOutcome = null;
  let parentFlowKey = null;

  // Find the outcome in the flow
  Object.keys(SUBTASK_FLOW.flows).some(flowKey => {
    const flow = SUBTASK_FLOW.flows[flowKey];
    if (flow.outcomes && flow.outcomes[outcomeId]) {
      foundOutcome = flow.outcomes[outcomeId];
      parentFlowKey = flowKey;
      return true;
    }
    return false;
  });

  const handleStartOver = () => {
    router.push('/introduction');
  };

  if (!foundOutcome) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Error: Outcome not found</h2>
        <div className="vads-u-margin-top--2">
          <VaButtonPair
            onSecondaryClick={handleStartOver}
            secondaryText="Start Over"
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {parentFlowKey && <h3>Current Flow: {parentFlowKey}</h3>}
      {foundOutcome.map((item, index) => (
        <div key={index}>
          <h3>{item.title}</h3>
          <div>{item.message}</div>
        </div>
      ))}
      <div className="vads-u-margin-top--2">
        <VaButton onClick={handleStartOver} text="Start Over" secondary />
      </div>
    </div>
  );
};

Results.propTypes = {
  params: PropTypes.shape({
    outcomeId: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Results);
