import React, { useState } from 'react';
import RadioOptions from './RadioOptions';
import { SUBTASK_FLOW } from '../subtasks';

const IntroPage = () => {
  const [selected, setSelected] = useState(null);

  const handleOptionChange = value => {
    setSelected(value);
  };

  const handleContinue = () => {
    if (selected) {
      // Navigate to the selected debt help option
      window.location.href = `/manage-va-debt/debt-help-options/${selected}`;
    }
  };

  const handleBack = () => {
    window.location.href = '/manage-va-debt/debt-help-options';
    // No-op since back functionality is not needed
  };

  return (
    <div>
      <RadioOptions
        config={SUBTASK_FLOW.intro}
        title="What’s this debt related to?"
        currentSubtask="intro"
        selectedValues={{}}
        onOptionChange={handleOptionChange}
        onContinue={handleContinue}
        onBack={handleBack}
        showBack={false}
      />
    </div>
  );
};

export default IntroPage;
