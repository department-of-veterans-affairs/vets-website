import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';

const topics = [
  'Burial',
  'Chapter 36-PCPG',
  'Compensation',
  'Dental',
  'Discharge-Upgrade',
  'Education',
  'Finance',
  'Health care',
  'Insurance',
  'Legal',
  'Loan Gauranty',
  'Mental Health Support/Resources',
  'Pension',
  'VA Records',
  'Veterans Readiness and Employment',
  'Woman Veterans Coordinator',
  'General VA Benefits',
];

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
      <va-checkbox-group
        error={null}
        hint={null}
        label="Check all that apply"
        label-header-level=""
        message-aria-describedby={null}
      >
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
      <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container">
        <va-button secondary onClick={handleBack} text="Back" uswds />
        <va-button onClick={handleContinue} text="Continue" uswds />
      </div>
    </Wrapper>
  );
};

export default TopicSelection;
