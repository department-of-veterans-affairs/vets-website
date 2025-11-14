import React, { useState } from 'react';
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
  return (
    <Wrapper pageTitle="What topic would you like to talk about?" required>
      <va-link
        href="/service-member/benefits/solid-start/schedule/review"
        text="Continue"
      />
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
    </Wrapper>
  );
};

export default TopicSelection;
