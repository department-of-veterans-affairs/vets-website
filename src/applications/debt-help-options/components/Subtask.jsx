import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  VaButtonPair,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SUBTASK_FLOW } from '../subtasks';

const Subtasks = props => {
  const { questionId } = props.params;
  const [selectedOption, setSelectedOption] = useState(null);

  const handleCustomEvent = event => {
    if (event.target.tagName.toLowerCase() === 'va-radio') {
      setSelectedOption(event.detail.value);
    }
  };

  const handleContinue = () => {
    if (selectedOption) {
      props.router.push(selectedOption);
    }
  };

  const handleBack = () => {
    props.router.push('introduction');
  };

  useEffect(() => {
    document.addEventListener('vaValueChange', handleCustomEvent);
    return () => {
      document.removeEventListener('vaValueChange', handleCustomEvent);
    };
  }, []);

  useEffect(
    () => {
      setSelectedOption(null);
    },
    [questionId],
  );

  let foundQuestion = null;
  let foundOutcome = null;
  let parentFlowKey = null;

  Object.keys(SUBTASK_FLOW.flows).some(flowKey => {
    const flow = SUBTASK_FLOW.flows[flowKey];

    if (questionId === flowKey && flow.questions && flow.questions.initial) {
      foundQuestion = flow.questions.initial;
      parentFlowKey = flowKey;
      return true;
    }

    if (flow.questions && flow.questions[questionId]) {
      foundQuestion = flow.questions[questionId];
      parentFlowKey = flowKey;
      return true;
    }

    if (flow.outcomes && flow.outcomes[questionId]) {
      foundOutcome = flow.outcomes[questionId];
      parentFlowKey = flowKey;
      return true;
    }

    return false;
  });

  if (!foundOutcome && !foundQuestion) {
    const flow = SUBTASK_FLOW.flows[questionId];
    if (flow && flow.outcomes) {
      const outcomeKeys = Object.keys(flow.outcomes);
      if (outcomeKeys.length === 1) {
        foundOutcome = flow.outcomes[outcomeKeys[0]];
        parentFlowKey = questionId;
      }
    }
  }

  if (foundQuestion) {
    return (
      <div style={{ padding: '20px' }}>
        {parentFlowKey && <h3>Current Flow: {parentFlowKey}</h3>}
        <va-radio
          label={foundQuestion.title}
          name="navigationOptions"
          required
          label-header-level="2"
          value={selectedOption}
        >
          {foundQuestion.options.map(option => (
            <va-radio-option
              key={option.value}
              name="navigationOptions"
              label={option.label}
              value={option.nextStep}
              description={option.description}
              checked={option.nextStep === selectedOption}
            />
          ))}
        </va-radio>

        <div className="vads-u-margin-top--2">
          <VaButtonPair
            continue
            onPrimaryClick={handleContinue}
            onSecondaryClick={handleBack}
            primaryDisabled={!selectedOption}
          />
        </div>
      </div>
    );
  }

  if (foundOutcome) {
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
          <VaButton onClick={handleBack} text="Start Over" secondary />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Error: Subtask not found.</h2>
      <div className="vads-u-margin-top--2">
        <VaButtonPair
          onSecondaryClick={handleBack}
          secondaryText="Start Over"
        />
      </div>
    </div>
  );
};

Subtasks.propTypes = {
  params: PropTypes.shape({
    questionId: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Subtasks);
