import React from 'react';
// import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import moment from 'moment/moment';
import IntroductionPage from './containers/IntroductionPage';
import IntroductionPageUpdate from './containers/IntroductionPageUpdate';
import { convertToggle } from '../utils/helpers';

export const isProductionOfTestProdEnv = automatedTest => {
  const toggle = convertToggle();
  return toggle || automatedTest || global?.window?.isProd;
};

export const introductionPage = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? IntroductionPage
    : IntroductionPageUpdate;
};

export const sponsorInformationTitle = (automatedTest = false) => {
  if (isProductionOfTestProdEnv(automatedTest)) {
    return 'Sponsor information';
  }
  return 'DEA, Chapter 35 sponsor information';
};

export const directDepositMethod = (formData, automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? formData.bankAccountChange
    : formData.bankAccountChangeUpdate;
};

export const buildSubmitEventData = formData => {
  const yesNoOrUndefined = value => {
    if (value === undefined) {
      return undefined;
    }
    return value ? 'Yes' : 'No';
  };

  return {
    'benefits-used-recently': formData.benefit,
    'new-service-periods-to-record': yesNoOrUndefined(
      formData['view:newService'],
    ),
    'service-details': (formData.toursOfDuty || []).map(tour => ({
      'service-branch': tour.serviceBranch,
      'service-start-date': tour.dateRange.from,
      'service-end-date': tour.dateRange.to,
    })),
    'service-before-1978': yesNoOrUndefined(
      formData['view:hasServiceBefore1978'],
    ),
    'edu-desired-facility-name': formData.newSchoolName,
    'edu-desired-type-of-education': formData.educationType,
    'edu-desired-facility-state': formData.newSchoolAddress?.state,
    'edu-desired-facility-city': formData.newSchoolAddress?.city,
    'edu-prior-facility-name': formData.oldSchool?.name,
    'edu-prior-facility-state': formData.oldSchool?.address.state,
    'edu-prior-facility-city': formData.oldSchool?.address.city,
    'edu-prior-facility-end-date': formData.trainingEndDate,
    'preferred-contact-method': formData.preferredContactMethod,
    married: yesNoOrUndefined(formData.serviceBefore1977?.married),
    'dependent-children': yesNoOrUndefined(
      formData.serviceBefore1977?.haveDependents,
    ),
    'dependent-parent': yesNoOrUndefined(
      formData.serviceBefore1977?.parentDependent,
    ),
    'direct-deposit-method': directDepositMethod(formData),
    'direct-deposit-account-type': formData.bankAccount?.accountType,
  };
};

export const eighteenOrOver = birthday => {
  return (
    birthday === undefined ||
    birthday.length !== 10 ||
    moment().diff(moment(birthday, 'YYYY-MM-DD'), 'years') > 17
  );
};

export const eighteenOrOverUpdate = birthday => {
  return (
    birthday === undefined ||
    birthday.length !== 10 ||
    !moment(birthday, 'YYYY-MM-DD').isValid() ||
    moment().diff(moment(birthday, 'YYYY-MM-DD'), 'years') > 17
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
        {isProductionOfTestProdEnv() &&
          'Applicants under the age of 18 can’t legally make a benefits election.'}
        Based on your date of birth, please have a parent, guardian, or
        custodian review the information on this application, provide their
        contact information in the Guardian Section of this form, and click the
        "Submit application" button at the end of this form.
      </p>
    </div>
  </div>
);

export const isEighteenOrOlder = (birthday, automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? eighteenOrOver(birthday)
    : eighteenOrOverUpdate(birthday);
};
