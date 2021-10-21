import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export const directDepositWarning = (
  <div className="pension-dd-warning">
    The Department of Treasury requires all federal benefit payments be made by
    electronic funds transfer (EFT), also called direct deposit. If you don’t
    have a bank account, you must get your payment through Direct Express Debit
    MasterCard. To request a Direct Express Debit MasterCard you must apply at{' '}
    <a
      href="http://www.usdirectexpress.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      www.usdirectexpress.com
    </a>{' '}
    or by telephone at <a href="tel:8003331795">1-800-333-1795</a>. If you chose
    not to enroll, you must contact representatives handling waiver requests for
    the Department of Treasury at
    <a href="tel:8882242950">1-888-224-2950</a>. They will address any questions
    or concerns you may have and encourage your participation in EFT.
  </div>
);

export const activeDutyLabel = (
  <>
    Montgomery GI Bill Active Duty (Chapter 30)
    <AdditionalInfo triggerText="Learn more">
      <p>
        Our records indicate you may be eligible for this benefit because you
        served at least two years on active duty and were honorably discharged.
        If you give up this benefit, VA will pay you for any eligible kickers
        associated with it.
      </p>
      <a
        href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about the Montgomery GI Bill Active Duty
      </a>
    </AdditionalInfo>
  </>
);

export const selectedReserveLabel = (
  <>
    Montgomery GI Bill Selected Reserve (Chapter 1606)
    <AdditionalInfo triggerText="Learn more">
      <p>
        Our records indicate you may be eligible for this benefit because you
        agreed to serve six years in the Selected Reserve. If you give up this
        benefit, VA will pay you for any eligible kickers associated with it.
      </p>
      <a
        href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about the Montgomery GI Bill Selected Reserve
      </a>
    </AdditionalInfo>
  </>
);

export const unsureDescription = (
  <>
    <strong>Note:</strong> After you submit this applicaton, a VA representative
    will reach out to help via your preferred contact method.
  </>
);

export const post911GiBillNote = (
  <div className="usa-alert background-color-only">
    <h3>You’re applying for the Post-9/11 GI BIll®</h3>
    <p>
      At this time, you can only apply for Post-9/11 GI Bill (Chapter 33)
      benefits through this application. If you want to apply for other
      education benefits, <a href="#">find out what you’re eligible for.</a>
    </p>
  </div>
);

/**
 * Formats a date in human-readable form. For example:
 * January 1, 2000.
 *
 * @param {*} rawDate A date in the form '01-01-2000'
 * @returns A human-readable date string.
 */
export const formatReadableDate = rawDate => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let dateParts;
  let date;

  if (rawDate) {
    dateParts = rawDate.split('-');
    date = new Date(
      Number.parseInt(dateParts[0], 10),
      Number.parseInt(dateParts[1], 10) - 1,
      Number.parseInt(dateParts[2], 10),
    );
  }

  if (!date) {
    return '';
  }

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * This function recieves the uiSchema and formData objects and returns
 * a comma separated list of the selected checkboxes in a checkbox
 * group.  The formData object contains the name of the checkbox
 * elements in the group as the keys with a boolean value as the proerty
 * (true if checked, false if unchecked). Here is an example:
 *
 * ```
 * {
 *   canEmailNotify: true,
 *   canTextNotify: false
 * }
 * ```
 *
 * The following function splits the formData object into a 2D array
 * where each array item has two properties: the key and the form value
 * (a boolean).  So, our example above would end up being:
 *
 * ```
 * [
 *   ['canEmailNotify', true],
 *   ['canTextNotify', false]
 * ]
 * ```
 *
 * It then filters the formData object, selecting only the checkboxes
 * that are checked.  Then, it retrieves the titles of the selected keys
 * from the uiSchema and joins them with a comma.
 *
 * Also, Object.entries splits the formData data object into
 *
 * @param {*} uiSchema UI Schema object
 * @param {*} formData Form Data object.
 * @returns Comma separated list of selected checkbox titles.
 */
export const getSelectedCheckboxes = (uiSchema, formData) =>
  Object.entries(formData)
    .filter(checkboxOption => checkboxOption[1]) // true/false
    .map(checkboxOption => checkboxOption[0]) // object key
    .map(selectedCheckboxKey => uiSchema[selectedCheckboxKey]['ui:title'])
    .join(', ');

export function prefillTransformer(pages, formData, metadata, state) {
  let newData = formData;

  newData = {
    ...newData,
    'view:userFullName': {
      userFullName: state.user.profile?.userFullName,
    },
    dateOfBirth: state.user.profile?.dob,
  };

  return {
    metadata,
    formData: newData,
    pages,
    state,
  };
}
