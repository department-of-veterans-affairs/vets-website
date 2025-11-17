import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';
import { topics } from '../services/Topic/topic';
import ButtonPair from '../components/ButtonPair';

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
    setSelectedTopics([]);
    navigate(-1);
  };

  const handleContinue = () => {
    navigate('/review');
  };
  return (
    <Wrapper pageTitle="What topic would you like to talk about?" required>
      <va-checkbox-group label="Check all that apply">
        {topics.map(topic => (
          <VaCheckbox
            key={topic}
            label={topic}
            name="topic"
            value={topic}
            onVaChange={handleTopicChange}
            checked={selectedTopics.includes(topic)}
          />
        ))}
      </va-checkbox-group>
      <ButtonPair onBack={handleBack} onContinue={handleContinue} />
    </Wrapper>
  );
};

export default TopicSelection;
