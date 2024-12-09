import React from 'react';
import _, { merge } from 'lodash';
import { differenceInYears, parseISO } from 'date-fns';

export function prefillTransformer(pages, formData, metadata) {
  const newFormData = {
    ...formData,
  };

  if (formData) {
    const { email, homePhone, mobilePhone } = formData;

    delete newFormData.email;
    delete newFormData.homePhone;
    delete newFormData.mobilePhone;

    const newContactInfo = {
      ...(email && { email }),
      ...(homePhone && { homePhone }),
      ...(mobilePhone && { mobilePhone }),
    };

    if (!_.isEmpty(newContactInfo)) {
      merge(newFormData, newContactInfo);
    }
  }

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}

export const benefitsEligibilityBox = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">
      <ul>
        <li>You may be eligible for more than 1 education benefit program.</li>
        <li>
          If you wish to apply for more than one benefit, submit another 22-1990
          application.
        </li>
        <li>You can only get payments from 1 program at a time.</li>
        <li>
          You can’t get more than 48 months of benefits under any combination of
          VA education programs.
        </li>
      </ul>
    </div>
  </div>
);

export const reserveKickerWarning = (
  <div className="usa-alert usa-alert-warning usa-content secondary">
    <div className="usa-alert-body">
      <span>
        You can only transfer a kicker from a benefit that you relinquish (give
        up). You chose to relinquish <strong>MGIB-SR</strong> so you won’t get
        your Active Duty kicker.
      </span>
    </div>
  </div>
);

export const eighteenOrOver = birthday => {
  return (
    birthday === undefined ||
    birthday.length !== 10 ||
    differenceInYears(new Date(), parseISO(birthday)) >= 18
  );
};

export const SeventeenOrOlder = birthday => {
  return (
    birthday === undefined ||
    birthday.length !== 10 ||
    differenceInYears(new Date(), parseISO(birthday)) >= 17
  );
};

export const ageWarning = (
  <div
    className="vads-u-display--flex vads-u-align-items--flex-start vads-u-background-color--primary-alt-lightest vads-u-margin-top--3 vads-u-padding-right--3"
    aria-live="polite"
  >
    <div className="vads-u-flex--1 vads-u-margin-top--2p5 vads-u-margin-x--2 ">
      <va-icon icon="info" />
    </div>
    <div className="vads-u-flex--5">
      <p className="vads-u-font-size--base">
        Applicants under the age of 18 can’t legally make a benefits election.
        Based on your date of birth, please have a parent, guardian, or
        custodian review the information on this application, provide their
        contact information in the Guardian Section of this form, and click the
        "Submit application" button at the end of this form.
      </p>
    </div>
  </div>
);
