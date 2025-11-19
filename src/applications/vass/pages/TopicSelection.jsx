import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';
import { topics } from '../services/Topic/topic';

const TopicSelection = () => {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleTopicChange = event => {
    const { checked } = event.detail;
    if (checked) {
      setSelectedTopics([...selectedTopics, event.target.value]);
    } else {
      setSelectedTopics(
        selectedTopics.filter(topic => topic !== event.target.value),
      );
    }
  };

  const handleBack = () => {
    // TODO: manage state
    navigate(-1);
  };

  const handleContinue = () => {
    // TODO: manage state && error handling
    navigate('/review');
  };
  return (
    <Wrapper
      pageTitle="What topic would you like to talk about?"
      showBackButton
    >
      <va-checkbox-group
        required
        data-testid="topic-checkbox-group"
        label="Check all that apply"
      >
        {topics.map(topic => (
          <VaCheckbox
            key={topic}
            data-testid={`topic-checkbox-${topic
              .toLowerCase()
              .replace(/\s+/g, '-')}`}
            label={topic}
            name="topic"
            value={topic}
            onVaChange={handleTopicChange}
            checked={selectedTopics.includes(topic)}
          />
        ))}
      </va-checkbox-group>
      <VaButtonPair
        data-testid="button-pair"
        continue
        onPrimaryClick={handleContinue}
        onSecondaryClick={handleBack}
        class="vads-u-margin-top--4"
      />
    </Wrapper>
  );
};

export default TopicSelection;
