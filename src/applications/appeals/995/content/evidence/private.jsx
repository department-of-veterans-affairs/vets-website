import React from 'react';
import {
  getProviderDetailsTitle,
  getSelectedIssues,
} from '../../utils/evidence';
import { PRIVATE_TREATMENT_LOCATION_KEY } from '../../constants';
import { formatIssueList } from '../../../shared/utils/contestableIssueMessages';
import { formatDateToReadableString } from '../../../shared/utils/dates';

export const introContent = {
  title: 'Add your private provider or VA Vet Center details',
};

export const summaryContent = {
  title:
    'Review the private providers or VA Vet Centers we’ll request your records from',
  question:
    'Do you want us to request records from another private provider or VA Vet Center?',
  options: {
    Y: 'Yes',
    N: 'No',
  },
  alertItemUpdatedText: itemData =>
    `${itemData[PRIVATE_TREATMENT_LOCATION_KEY]} information has been updated.`,
  cardDescription: item => {
    const selectedIssues = getSelectedIssues(item?.issues);

    return (
      <>
        {selectedIssues?.length === 1 && (
          <p>
            <strong>Condition:</strong> {selectedIssues[0]}
          </p>
        )}
        {selectedIssues?.length > 1 && (
          <p>
            <strong>Conditions:</strong> {formatIssueList(selectedIssues)}
          </p>
        )}
        {item?.treatmentEnd &&
          item?.treatmentStart && (
            <p>
              <strong>Treatment:</strong>
              &nbsp;
              {formatDateToReadableString(
                new Date(`${item.treatmentStart}T12:00:00`),
              )}{' '}
              to{' '}
              {formatDateToReadableString(
                new Date(`${item.treatmentEnd}T12:00:00`),
              )}
            </p>
          )}
      </>
    );
  },
  requiredError:
    'Select if you want to add another private provider or VA Vet Center',
};

export const detailsEntryContent = {
  question: (formContext, addOrEdit) => {
    const index = formContext?.pagePerItemIndex || 0;

    return getProviderDetailsTitle(addOrEdit, +index + 1, 'nonVa', true);
  },
  label:
    'Enter the name and address of the private provider, facility, medical center, clinic, or VA Vet Center you want us to request your records from.',
  locationLabel: 'Location name',
  locationRequiredError: 'Enter a location name',
};

export const treatmentDateContent = {
  question: (formContext, addOrEdit) => {
    const location = formContext?.[PRIVATE_TREATMENT_LOCATION_KEY];

    if (addOrEdit === 'add') {
      return location
        ? `When were you treated at ${location}?`
        : 'When were you treated?';
    }

    return location
      ? `when you were treated at ${location}`
      : `when you were treated`;
  },
  firstDateLabel: 'First date of treatment',
  dateHint:
    'Enter 2 digits for the month and day and 4 digits for the year. You can estimate the date.',
  lastDateLabel: 'Last date of treatment',
  requiredError: 'Enter a month from 1 to 12, even if it’s an estimate',
};
