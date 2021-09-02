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
      Our records indicate you may be eligible for this benefit because you
      served at least two years on active duty and were honorably discharged.
      <a
        href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {' '}
        Learn more about the Montgomery GI Bill Active Duty
      </a>
    </AdditionalInfo>
  </>
);

export const selectedReserveLabel = (
  <>
    Montgomery GI Bill Selected Reserve (Chapter 1606)
    <AdditionalInfo triggerText="Learn more">
      Our records indicate you may be eligible for this benefit because you
      agreed to serve six years in the Selected Reserve.
      <a
        href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {' '}
        Learn more about the Montgomery GI Bill Selected Reserve
      </a>
    </AdditionalInfo>
  </>
);

export const unsureDescription = (
  <>
    <strong>Note:</strong> After you submit this applicaiton, a VA
    representative will reach out to help via your preferred contact method.
  </>
);

// export const benefitSelectionNote = (
//   <div className="usa-alert background-color-only">
//     <h3>You’re applying for the Post-9/11 GI BIll®</h3>
//     <p>
//       Currently, you can only apply for Post-9/11 GI Bill (Chapter 33) benefits
//       through this application. If you would like to apply for other benefits,
//       please visit our <a href="#">How To Apply</a> page.
//     </p>
//   </div>
// );

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
