import React from 'react';

export const gaRatioCalculationText = () => {
  window.dataLayer.push({
    event: 'edu-0994--form-help-text-clicked',
    'help-text-label': 'How is this calculated?',
  });
};

export const ratioCalcInfoHelpText = (
  <va-additional-info
    trigger="How is this calculated?"
    onClick={gaRatioCalculationText}
  >
    <span>
      <p>
        (Number of VA beneficiary students divided by Total number of students)
        multiplied by 100 = Percentage of VA beneficiary students
      </p>
      <p>
        If this percentage seems incorrect, please check the numbers you entered
        above.
      </p>
    </span>
  </va-additional-info>
);
