import React from 'react';
import { getProviderDetailsTitle } from '../../utils/evidence';
import {
  PRIVATE_LOCATION_TREATMENT_DATES_KEY,
  PRIVATE_TREATMENT_LOCATION_KEY,
} from '../../constants';
import { formatIssueList } from '../../../shared/utils/contestableIssueMessages';

export const promptContent = {
  question:
    'Do you want us to get your private (non-VA) provider or VA Vet Center medical records?',
  // options: [
  //   {
  //     value: 'Y',
  //     description: `We'll ask you to provide details for your private providers to authorize the release of your medical records to VA.`,
  //     label: 'Yes',
  //   },
  //   {
  //     value: 'N',
  //     description:
  //       'You can upload your private provider records later in this form, or you can authorize us to get them after you submit this application.',
  //     label: 'No',
  //   },
  // ],
  options: {
    Y: `We'll ask you to provide details for your private providers to authorize the release of your medical records to VA.`,
    N:
      'You can upload your private provider records later in this form, or you can authorize us to get them after you submit this application.',
  },
  description: (
    <>
      <p>
        You have private provider or VA Vet Center medical records if you were
        treated by a:
      </p>
      <ul>
        <li>Private provider</li>
        <li>Veterans Choice Program provider</li>
        <li>VA Vet Center (this is different from VA-paid community care)</li>
      </ul>
      <p className="vads-u-margin-bottom--0">
        <strong>Note:</strong> A Disability Benefits Questionnaire (DBQ) is an
        example of a private medical record.
      </p>
    </>
  ),
  requiredError:
    'Select if we should get your private (non-VA) medical records',
};

export const summaryContent = {
  titleWithItems: 'Review the evidence you’re submitting',
  descriptionWithItems: (
    <p className="vads-u-font-family--serif vads-u-font-weight--bold">
      Private providers or VA Vet Centers we’ll request your records from
    </p>
  ),
  question:
    'Do you want us to request records from another private provider or VA Vet Center?',
  options: {
    Y: 'Yes',
    N: 'No',
  },
  alertItemUpdatedText: itemData =>
    `${itemData[PRIVATE_TREATMENT_LOCATION_KEY]} information has been updated.`,
  cardDescription: item => {
    console.log('item: ', item);
    return (
      <>
        {item?.[PRIVATE_TREATMENT_LOCATION_KEY] && (
          <h3 className="vads-u-margin-top--0">
            {item[PRIVATE_TREATMENT_LOCATION_KEY]}
          </h3>
        )}
        {item?.issues?.length === 1 && (
          <p>
            <strong>Condition:</strong> {item.issues[0]}
          </p>
        )}
        {item?.issues?.length > 1 && (
          <p>
            <strong>Conditions:</strong> {formatIssueList(item.issues)}
          </p>
        )}
        {item?.[PRIVATE_LOCATION_TREATMENT_DATES_KEY](
          <p>
            <strong>Treatment start date:</strong>
            &nbsp;
            {/* {formatMonthYear(item[PRIVATE_LOCATION_TREATMENT_DATES_KEY])} */}
          </p>,
        )}
      </>
    );
  },
};

export const detailsEntryContent = {
  question: (formContext, addOrEdit) => {
    const index = formContext?.pagePerItemIndex || 0;

    return getProviderDetailsTitle(addOrEdit, +index + 1, 'nonVa');
  },
  label:
    'Enter the name and address of the private provider, facility, medical center, clinic, or VA Vet Center you want us to request your records from.',
  locationLabel: 'Location name',
  locationRequiredError: 'Enter a location name',
};

export const treatmentDateContent = {
  question: (formContext, addOrEdit) => {
    const location = formContext?.treatmentLocation;

    if (addOrEdit === 'add') {
      return location
        ? `When were you treated at ${location}?`
        : 'When were you treated?';
    }

    return location
      ? `Edit when you were treated at ${location}`
      : `Edit when you were treated`;
  },
  firstDateLabel: 'First date of treatment',
  dateHint:
    'Enter 2 digits for the month and day and 4 digits for the year. You can estimate the date.',
  lastDateLabel: 'Last date of treatment',
  requiredError: 'Enter a month from 1 to 12, even if it’s an estimate',
};
