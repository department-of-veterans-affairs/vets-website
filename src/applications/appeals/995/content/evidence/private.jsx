import React from 'react';
import { getProviderDetailsTitle } from '../../utils/evidence';
import { PRIVATE_LOCATION_DETAILS_KEY } from '../../constants';
import { formatIssueList } from '../../../shared/utils/contestableIssueMessages';

export const promptContent = {
  question:
    'Do you want us to get your private (non-VA) provider or VA Vet Center medical records?',
  options: {
    Y:
      'We’ll ask you questions from VA Forms 21-4142 and 21-4142a Authorize the release of non-VA medical records to VA',
    N:
      'You can upload non-VA medical records later in the form or fill out the 21-4142 and 21-4142a separately at a later time',
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
    `${itemData[PRIVATE_LOCATION_DETAILS_KEY]} information has been updated.`,
  cardDescription: item => (
    <>
      {item?.[PRIVATE_LOCATION_DETAILS_KEY] && (
        <h3 className="vads-u-margin-top--0">
          {item[PRIVATE_LOCATION_DETAILS_KEY]}
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
      {item?.[PRIVATE_LOCATION_DETAILS_KEY] && (
        <p>
          <strong>Treatment start date:</strong>
          &nbsp;
          {/* {formatMonthYear(item[PRIVATE_LOCATION_DETAILS_KEY])} */}
        </p>
      )}
    </>
  ),
};

export const detailsContent = {
  question: (addOrEdit, index) =>
    getProviderDetailsTitle(addOrEdit, index, 'nonVa'),
  label:
    'Enter the name and address of the private provider, facility, medical center, clinic, or VA Vet Center you want us to request your records from.',
  locationLabel: 'Location name',
};
