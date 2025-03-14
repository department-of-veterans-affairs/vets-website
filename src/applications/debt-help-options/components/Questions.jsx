import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SUBTASK_FLOW } from '../subtasks';

const Questions = ({ router, params }) => {
  const { questionId } = params;
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const handleCustomEvent = event => {
      if (event.target.tagName.toLowerCase() === 'va-radio') {
        setSelectedOption(event.detail.value);
      }
    };

    document.addEventListener('vaValueChange', handleCustomEvent);
    return () =>
      document.removeEventListener('vaValueChange', handleCustomEvent);
  }, []);

  useEffect(
    () => {
      setSelectedOption(null);
    },
    [questionId],
  );

  const getNavigationPath = () => {
    const { flows } = SUBTASK_FLOW;

    if (
      Object.values(flows).some(
        flow => flow.outcomes && flow.outcomes[selectedOption],
      )
    ) {
      return `/results/${selectedOption}`;
    }

    const flow = flows[selectedOption];
    if (flow && flow.outcomes && !flow.questions) {
      const outcomeKeys = Object.keys(flow.outcomes);
      if (outcomeKeys.length === 1) {
        return `/results/${outcomeKeys[0]}`;
      }
    }

    return `/questions/${selectedOption}`;
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    router.push(getNavigationPath());
  };

  const handleBack = () => router.push('/intro');

  let foundQuestion = null;
  let parentFlowKey = null;
  for (const [flowKey, flow] of Object.entries(SUBTASK_FLOW.flows)) {
    if (questionId === flowKey && flow.questions?.initial) {
      foundQuestion = flow.questions.initial;
      parentFlowKey = flowKey;
      break;
    }
    if (flow.questions && flow.questions[questionId]) {
      foundQuestion = flow.questions[questionId];
      parentFlowKey = flowKey;
      break;
    }
  }

  if (!foundQuestion) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Error: Question not found</h2>
        <div className="vads-u-margin-top--2">
          <VaButtonPair
            onSecondaryClick={() => router.push('/intro')}
            secondaryText="Start Over"
          />
        </div>
      </div>
    );
  }

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
};

Questions.propTypes = {
  params: PropTypes.shape({
    questionId: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Questions);
