import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

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
      newFormData['view:otherContactInfo'] = newContactInfo;
    }
  }

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  const newformData = JSON.parse(formData);
  switch (newformData.chapter33) {
    case 'chapter33':
      newformData.chapter33 = true;
      break;
    case 'chapter30':
      newformData.chapter30 = true;
      break;
    case 'chapter1606':
      newformData.chapter1606 = true;
      break;
    default:
      break;
  }

  if (typeof newformData.chapter33 === 'string') {
    delete newformData.chapter33;
  }
  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(newformData),
    },
  });
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

export const benefitsRelinquishmentLabels = {
  unknown: 'I’m only eligible for the Post-9/11 GI Bill',
  chapter30: 'Montgomery GI Bill (MGIB-AD, Chapter 30)',
  chapter1606: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
  chapter1607: 'Reserve Educational Assistance Program (REAP, Chapter 1607)',
};

export const benefitsRelinquishmentWarning = (
  <div>
    <p>
      Because you chose to apply for your Post-9/11 benefit, you have to
      relinquish (give up) 1 other benefit you may be eligible for.
    </p>
    <p>
      <strong>Your decision is irrevocable</strong> (you can’t change your
      mind).
    </p>
    <br />
  </div>
);

export const benefitsRelinquishedDescription = (
  <span>
    <br />
    If you have questions or don’t understand the choice, talk to a specialist
    at 1-888-GI-BILL-1 (<va-telephone contact="8884424551" />
    ), Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. ET.
  </span>
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
    moment().diff(moment(birthday, 'YYYY-MM-DD'), 'years') > 17
  );
};

export const SeventeenOrOlder = birthday => {
  return (
    birthday === undefined ||
    birthday.length !== 10 ||
    moment().diff(moment(birthday, 'YYYY-MM-DD'), 'years') > 16
  );
};

export const ageWarning = (
  <div
    className="vads-u-display--flex vads-u-align-items--flex-start vads-u-background-color--primary-alt-lightest vads-u-margin-top--3 vads-u-padding-right--3"
    aria-live="polite"
  >
    <div className="vads-u-flex--1 vads-u-margin-top--2p5 vads-u-margin-x--2 ">
      <va-icon
        size={4}
        icon="see name mappings here https://design.va.gov/foundation/icons"
      />
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
export const isProductionOfTestProdEnv = automatedTest => {
  return (
    environment.isProduction() ||
    automatedTest ||
    (global && global?.window && global?.window?.buildType)
  );
};
