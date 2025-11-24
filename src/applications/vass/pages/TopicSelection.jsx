import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';
import { topics } from '../services/Topic/topic';
import { usePersistentSelections } from '../hooks/usePersistentSelections';

// TODO: remove this once we have a real UUID
const UUID = 'af40d0e7-df29-4df3-8b5e-03eac2e760fa';

const TopicSelection = () => {
  const navigate = useNavigate();
  const { saveTopicsSelection, getSaved } = usePersistentSelections(UUID);
  const [selectedTopics, setSelectedTopics] = useState(
    getSaved()?.selectedTopics || [],
  );

  useEffect(
    () => {
      saveTopicsSelection(selectedTopics);
    },
    [saveTopicsSelection, selectedTopics],
  );

  const handleTopicChange = event => {
    const { checked } = event.detail;
    if (checked) {
      const newTopics = [...selectedTopics, event.target.value];
      setSelectedTopics(newTopics);
      saveTopicsSelection(newTopics);
    } else {
      const newTopics = selectedTopics.filter(
        topic => topic !== event.target.value,
      );
      setSelectedTopics(newTopics);
      saveTopicsSelection(newTopics);
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
    <Wrapper pageTitle="What topic would you like to talk about?" showBackLink>
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
