import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { SUBTASK_FLOW } from '../subtasks';

const config = SUBTASK_FLOW.intro;

const Introduction = ({ router }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleCustomEvent = event => {
    if (event.target.tagName.toLowerCase() === 'va-radio') {
      setSelectedOption(event.detail.value);
    }
  };

  const handleContinue = () => {
    if (selectedOption) {
      const flow = SUBTASK_FLOW.flows[selectedOption];
      if (flow && flow.outcomes && !flow.questions) {
        const outcomeKeys = Object.keys(flow.outcomes);
        if (outcomeKeys.length === 1) {
          router.push(`/results/${outcomeKeys[0]}`);
          return;
        }
      }
      router.push(`/questions/${selectedOption}`);
    }
  };

  useEffect(() => {
    document.addEventListener('vaValueChange', handleCustomEvent);
    return () => {
      document.removeEventListener('vaValueChange', handleCustomEvent);
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <va-radio
        label="What's this debt related to?"
        name="navigationOptions"
        required
        label-header-level="2"
        value={selectedOption}
      >
        {config.map(option => (
          <va-radio-option
            key={option.value}
            name="navigationOptions"
            label={option.label}
            value={option.value}
            description={option.description}
            checked={option.value === selectedOption}
          />
        ))}
      </va-radio>

      <div className="vads-u-margin-top--2">
        <VaButtonPair
          continue
          onPrimaryClick={handleContinue}
          primaryDisabled={!selectedOption}
        />
      </div>
    </div>
  );
};

Introduction.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Introduction);
