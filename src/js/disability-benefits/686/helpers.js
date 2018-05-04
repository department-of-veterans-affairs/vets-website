import AdditionalInfo from '@department-of-veterans-affairs/jean-pants/AdditionalInfo';
import React from 'react';

export const relationshipLabels = {
  veteran: 'I am the Veteran',
  spouse: 'Spouse or surviving spouse',
  child: 'Unmarried adult child',
  other: 'Other'
};

export const VAFileNumberDescription = (
  <div className="additional-info-title-help">
    <AdditionalInfo triggerText="What does this mean?">
      <p>The VA file number is the number used to track your disability claim and evidence through the VA system. For most Veterans, your VA file number is the same as your Social Security number. However, if you filed your first disability claim a long time ago, your VA file number may be a different number.</p>
    </AdditionalInfo>
  </div>
);
