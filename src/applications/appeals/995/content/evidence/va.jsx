import React from 'react';
import { getProviderDetailsTitle } from '../../utils/evidence';

export const promptContent = {
  question:
    'Do you want us to get your VA medical records or military health records?',
  options: {
    Y:
      'Yes, get my VA medical records or military health records to support my claim',
    N:
      "No, I don't need my VA medical records or military health records to support my claim",
  },
  description: (
    <>
      <p>
        We can collect your VA medical records or military health records from
        any of these sources to support your claim:
      </p>
      <ul>
        <li>VA medical center</li>
        <li>Community-based outpatient clinic</li>
        <li>Department of Defense military treatment facility</li>
        <li>Community care provider paid for by VA</li>
      </ul>
      <p>We’ll ask you the names of the treatment locations to include.</p>
      <p>
        <strong>Note:</strong> Later in this form, we’ll ask about your private
        (non-VA) provider medical records.
      </p>
    </>
  ),
  requiredError: 'Select if we should get your VA medical records',
};

export const locationContent = {
  question: (addOrEdit, index) =>
    getProviderDetailsTitle(addOrEdit, index, 'va'),
  label: 'Enter the name of facility or provider that treated you',
  hint: 'You can add the names of more locations later',
  requiredError: 'Enter a treatment location',
  maxLengthError: 'You can enter a maximum of 255 characters',
};

export const summaryContent = {
  titleWithItems: 'Review the evidence you’re submitting',
  descriptionWithItems: 'VA or military treatment locations we’ll request your records from',
  question: 'Do you want us to request records from another VA provider?',
  options: {
    Y: 'Yes',
    N: 'No',
  },
};

export const issuesContent = {
  label: 'Select all the service-connected conditions you were treated for',
  requiredError: 'Select a condition',
};

export const datePromptContent = {
  label:
    'If your treatment started before 2005, we’ll ask for approximate dates to help us find the paper records.',
  options: {
    Y: 'Treatment started before 2005',
    N: 'Treatment started in 2005 or later',
  },
  requiredError: 'Select when your treatment started',
};

export const dateDetailsContent = {
  label: `We’ll use this date to help us find your paper records from 2005 or earlier (you can estimate).`,
  requiredError: 'Provide the month and year your treatment started',
};
