import React from 'react';
import { getProviderDetailsTitle } from '../../utils/evidence';
import {
  VA_TREATMENT_BEFORE_2005_KEY,
  VA_TREATMENT_LOCATION_KEY,
  VA_TREATMENT_MONTH_YEAR_KEY,
} from '../../constants';
import { formatMonthYearToReadableString } from '../../../shared/utils/dates';

export const promptContent = {
  topQuestion:
    'Do you want us to get your VA medical records or military health records?',
  aboveRadioQuestion: 'Do you want us to get your records?',
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

export const summaryContent = {
  titleWithItems:
    'Review the VA or military treatment locations we’ll request your records from',
  question: 'Do you want us to request records from another VA provider?',
  options: {
    Y: 'Yes',
    N: 'No',
  },
  alertItemUpdatedText: itemData =>
    `${itemData?.[VA_TREATMENT_LOCATION_KEY]} information has been updated.`,
  cardDescription: item => {
    return (
      <>
        {item?.[VA_TREATMENT_BEFORE_2005_KEY] === 'N' && (
          <p>
            <strong>Start of treatment:</strong> 2005 or later
          </p>
        )}
        {item?.[VA_TREATMENT_MONTH_YEAR_KEY] && (
          <>
            <p>
              <strong>Start of treatment:</strong> Before 2005
            </p>
            <p>
              <strong>Date:</strong>
              &nbsp;
              {formatMonthYearToReadableString(
                item[VA_TREATMENT_MONTH_YEAR_KEY],
              )}
            </p>
          </>
        )}
      </>
    );
  },
  requiredError: 'Select if you want to add another VA provider',
};

export const locationContent = {
  question: (formContext, addOrEdit) => {
    const index = formContext?.pagePerItemIndex || 0;
    // ------- Remove the .replace when the design toggle is removed
    // The current content requires the word "Edit" but it is baked into
    // array builder so we won't need it when that is the default path
    return getProviderDetailsTitle(
      addOrEdit,
      Number(index) + 1,
      'va',
      true,
    ).replace('Edit', '');
  },
  label: 'Enter the name of the facility or provider that treated you',
  hint: 'You can add the names of more locations later',
  requiredError: 'Enter a treatment location',
  maxLengthError: 'You can enter a maximum of 255 characters',
};

export const datePromptContent = {
  question: (formData, addOrEdit) => {
    const location = formData?.[VA_TREATMENT_LOCATION_KEY] || null;

    if (addOrEdit === 'edit') {
      return location
        ? `if treatment at ${location} started before 2005`
        : 'if treatment started before 2005';
    }

    return location
      ? `Did treatment at ${location} start before 2005?`
      : 'Did treatment start before 2005?';
  },
  label: `If treatment for your service-connected condition(s) started before 2005, we’ll ask for approximate dates to help us find the paper records.`,
  options: {
    Y: 'Treatment started before 2005',
    N: 'Treatment started in 2005 or later',
  },
  requiredError: 'Select when your treatment started',
};

export const dateDetailsContent = {
  question: (formData, addOrEdit) => {
    const location = formData?.[VA_TREATMENT_LOCATION_KEY] || null;

    if (addOrEdit === 'edit') {
      return location
        ? `when treatment at ${location} started`
        : 'when treatment started';
    }

    return formData?.[VA_TREATMENT_LOCATION_KEY]
      ? `When did treatment at ${formData[VA_TREATMENT_LOCATION_KEY]} start?`
      : 'When did treatment start?';
  },
  label: `We’ll use this date to help us find your paper records from 2005 or earlier (you can estimate).`,
  requiredError: 'Provide the month and year your treatment started',
};
