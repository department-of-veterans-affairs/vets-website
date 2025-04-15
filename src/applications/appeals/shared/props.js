import {
  arrayOf,
  bool,
  element,
  func,
  number,
  oneOf,
  shape,
  string,
} from 'prop-types';

import { SELECTED } from './constants';
import { PRIMARY_PHONE } from '../995/constants';

const common = {
  contestedIssues: arrayOf(
    shape({
      attributes: shape({
        ratingIssueSubjectText: string,
        description: string,
        ratingIssuePercentNumber: string,
        approxDecisionDate: string,
      }),
      [SELECTED]: bool,
    }),
  ),
  additionalIssues: arrayOf(
    shape({
      issue: string,
      decisionDate: string,
      [SELECTED]: bool,
    }),
  ),
  veteran: shape({
    ssnLastFour: string,
    vaFileLastFour: string,
    address: shape({
      addressLine1: string,
      addressLine2: string,
      addressLine3: string,
      city: string,
      countryName: string,
      countryCodeIso2: string,
      stateCode: string,
      zipCode: string,
      province: string,
      internationalPostalCode: string,
    }),
    homePhone: shape({
      countryCode: string,
      areaCode: string,
      phoneNumber: string,
      phoneNumberExt: string,
    }),
    mobilePhone: shape({
      countryCode: string,
      areaCode: string,
      phoneNumber: string,
      phoneNumberExt: string,
    }),
    email: string,
  }),
};

export const customPageProps = {
  contentAfterButtons: element,
  contentBeforeButtons: element,
  goBack: func,
  goForward: func,
  goToPath: func,
  pagePerItemIndex: number,
  setFormData: func,
  testingIndex: number,
  updatePage: func,
  onReviewPage: bool,
};

export const data995 = shape({
  ...common,
  benefitType: string,
  legacyCount: number,
  [PRIMARY_PHONE]: string,
  locations: arrayOf(
    shape({
      locationAndName: string,
      issues: arrayOf(string),
      treatmentDate: string,
      evidenceDates: shape({
        from: string,
        to: string,
      }),
    }),
  ),
  providerFacility: arrayOf(
    shape({
      providerFacilityName: string,
      providerFacilityAddress: shape({
        country: string,
        street: string,
        street2: string,
        city: string,
        state: string,
        postalCode: string,
      }),
      issues: arrayOf(string),
      treatmentDateRange: shape({
        from: string,
        to: string,
      }),
    }),
  ),
  limitedConsent: string,
  privacyAgreementAccepted: bool,
  form5103Acknowledged: bool,
  socOptIn: bool,
  additionalDocuments: arrayOf(
    shape({
      name: string,
      confirmationCode: string,
      attachmentId: string,
      size: number,
      isEncrypted: bool,
    }),
  ),
});

export const customPageProps995 = {
  ...customPageProps,
  ...data995,
};

export const data996 = shape({
  ...common,
  benefitType: string,
  legacyCount: number,
  homeless: bool,
  privacyAgreementAccepted: bool,
  socOptIn: bool,
  informalConference: string,
  areaOfDisagreement: arrayOf(
    oneOf([
      shape({
        ...common.contestedIssues,
        disagreementOptions: shape({
          serviceConnection: bool,
          effectiveDate: bool,
          evaluation: bool,
        }),
        otherEntry: string,
      }),
      shape({
        ...common.additionalIssues,
        disagreementOptions: shape({
          serviceConnection: bool,
          effectiveDate: bool,
          evaluation: bool,
        }),
        otherEntry: string,
      }),
    ]),
  ),
  informalConferenceRep: shape({
    firstName: string,
    lastName: string,
    phone: string,
    extension: string,
    email: string,
  }),
  informalConferenceTime: string,
});

export const customPageProps996 = {
  ...customPageProps,
  ...data996,
};

// TODO
export const data10182 = shape({
  ...common,
});

export const customPageProps10182 = {
  ...customPageProps,
  ...data10182,
};
