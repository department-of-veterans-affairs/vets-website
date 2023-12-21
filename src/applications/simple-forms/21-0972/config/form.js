import React from 'react';
import footerContent from '@department-of-veterans-affairs/platform-forms/FormFooter';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  claimantAddressTitle,
  claimantContactInformationTitle,
  claimantIsVeteran,
  claimantIsSpouse,
  claimantIsParent,
  claimantIsChild,
  claimantIsNotVeteran,
  claimantPersonalInformationTitle,
  claimantSsnTitle,
} from './helpers';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from './submit-transformer';

import preparerPersonalInformation from '../pages/preparerPersonalInformation';
import preparerAddress from '../pages/preparerAddress';
import preparerContactInformation from '../pages/preparerContactInformation';
import claimantIdentification from '../pages/claimantIdentification';
import claimantPersonalInformation from '../pages/claimantPersonalInformation';
import claimantSsn from '../pages/claimantSsn';
import claimantAddress from '../pages/claimantAddress';
import claimantContactInformation from '../pages/claimantContactInformation';
import {
  preparerQualificationsSchema1A,
  preparerQualificationsSchema1B,
  preparerQualificationsSchema1C,
  preparerQualificationsSchema1D,
} from '../pages/preparerQualifications1';
import preparerQualifications2 from '../pages/preparerQualifications2';
import veteranPersonalInformation from '../pages/veteranPersonalInformation';
import veteranIdentificationInformation1 from '../pages/veteranIdentificationInformation1';
import veteranIdentificationInformation2 from '../pages/veteranIdentificationInformation2';
import additionalInformation from '../pages/additionalInformation';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/minimal-test.json';

const mockData = testData;

const statementOfTruthBody = (
  <>
    <p>
      I understand that I may be asked to confirm the truthfulness of the
      answers to the best of my knowledge under penalty of perjury.
    </p>

    <p>
      I also understand that VA may request further documentation or evidence to
      verify or confirm my authorization to sign or complete an application on
      behalf of the person with the claim if necessary. VA may request any of
      these examples:
    </p>

    <ul>
      <li>
        Social Security Number (SSN) or Taxpayer Identification Number (TIN).
      </li>
      <li>
        A certificate or order from a court showing my authority to act for the
        person with the claim. The court must have competent jurisdiction, and
        the certificate or order must be signed and dated or time-stamped.
      </li>
      <li>
        A copy of documentation showing that I’m appointed as a fiduciary.
      </li>
      <li>
        Durable power of attorney showing the name and signature of the person
        with the claim, and my authority as attorney-in-fact or agent.
      </li>
      <li>
        Health care power of attorney, affidavit, or notarized statement from an
        institution or person responsible for the care of the claimant. The
        statement must explain the extent of the provided care.
      </li>
      <li>Any other documentation showing relevant authorization.</li>
    </ul>
    <p>
      I confirm that the identifying information in this form is accurate and
      has been represented correctly.
    </p>
  </>
);

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  transformForSubmit,
  trackingPrefix: '21-0972-alternate-signer-',
  dev: {
    showNavLinks: true,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body: statementOfTruthBody,
      // TODO: figure out what to put in the label
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'preparerFullName',
    },
  },
  formId: '21-0972',
  customText: {
    appType: 'form',
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your alternate signer application (21-0972) is in progress.',
      expired:
        'Your saved alternate signer application (21-0972) has expired. If you want to apply for alternate signer, please start a new application.',
      saved: 'Your alternate signer application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for alternate signer.',
    noAuth:
      'Please sign in again to continue your application for alternate signer.',
  },
  hideUnauthedStartLink: true,
  title: 'Sign VA claim forms as an alternate signer',
  subTitle: 'Alternate signer certification (VA Form 21-0972)',
  defaultDefinitions: {},
  chapters: {
    preparerPersonalInformationChapter: {
      title: 'Alternate signer’s personal information',
      pages: {
        preparerPersonalInformation: {
          path: 'preparer-personal-information',
          title: 'Alternate signer’s personal information',
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData:
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          uiSchema: preparerPersonalInformation.uiSchema,
          schema: preparerPersonalInformation.schema,
        },
      },
    },
    preparerAddressChapter: {
      title: 'Alternate signer’s mailing address',
      pages: {
        preparerAddress: {
          path: 'preparer-address',
          title: 'Alternate signer’s mailing address',
          uiSchema: preparerAddress.uiSchema,
          schema: preparerAddress.schema,
        },
      },
    },
    preparerContactInformationChapter: {
      title: 'Alternate signer’s contact information',
      pages: {
        preparerContactInformation: {
          path: 'preparer-contact-information',
          title: 'Alternate signer’s contact information',
          uiSchema: preparerContactInformation.uiSchema,
          schema: preparerContactInformation.schema,
        },
      },
    },
    claimantIdentificationChapter: {
      title: 'Who the alternate signer will be signing for',
      pages: {
        claimantIdentification: {
          path: 'claimant-identification',
          title: 'Who the alternate signer will be signing for',
          uiSchema: claimantIdentification.uiSchema,
          schema: claimantIdentification.schema,
        },
      },
    },
    claimantPersonalInformationChapter: {
      title: formData => claimantPersonalInformationTitle(formData),
      pages: {
        claimantPersonalInformation: {
          path: 'claimant-personal-information',
          // skip if claimant is the veteran
          depends: formData => claimantIsNotVeteran({ formData }),
          uiSchema: claimantPersonalInformation.uiSchema,
          schema: claimantPersonalInformation.schema,
        },
      },
    },
    claimantSsnChapter: {
      title: formData => claimantSsnTitle(formData),
      pages: {
        claimantSsn: {
          path: 'claimant-identification-information',
          // skip if claimant is the veteran
          depends: formData => claimantIsNotVeteran({ formData }),
          uiSchema: claimantSsn.uiSchema,
          schema: claimantSsn.schema,
        },
      },
    },
    claimantAddressChapter: {
      title: formData => claimantAddressTitle(formData),
      pages: {
        claimantAddress: {
          path: 'claimant-address',
          // skip if claimant is the veteran
          depends: formData => claimantIsNotVeteran({ formData }),
          uiSchema: claimantAddress.uiSchema,
          schema: claimantAddress.schema,
        },
      },
    },
    claimantContactInformationChapter: {
      title: formData => claimantContactInformationTitle(formData),
      pages: {
        claimantContactInformation: {
          path: 'claimant-contact-information',
          // skip if claimant is the veteran
          depends: formData => claimantIsNotVeteran({ formData }),
          uiSchema: claimantContactInformation.uiSchema,
          schema: claimantContactInformation.schema,
        },
      },
    },
    preparerQualificationsChapter: {
      title: 'Qualifications',
      pages: {
        preparerQualifications1A: {
          // for veteran claimant
          path: 'preparer-qualifications-1a',
          title: 'Qualifying relationship',
          depends: formData => claimantIsVeteran({ formData }),
          ...preparerQualificationsSchema1A,
        },
        preparerQualifications1B: {
          // for spouse claimant
          path: 'preparer-qualifications-1b',
          title: 'Qualifying relationship',
          depends: formData => claimantIsSpouse({ formData }),
          ...preparerQualificationsSchema1B,
        },
        preparerQualifications1C: {
          // for parent claimant
          path: 'preparer-qualifications-1c',
          title: 'Qualifying relationship',
          depends: formData => claimantIsParent({ formData }),
          ...preparerQualificationsSchema1C,
        },
        preparerQualifications1D: {
          // for child claimant
          path: 'preparer-qualifications-1d',
          title: 'Qualifying relationship',
          depends: formData => claimantIsChild({ formData }),
          ...preparerQualificationsSchema1D,
        },
        preparerQualifications2: {
          path: 'preparer-qualifications-2',
          title: 'Qualifying reasons',
          uiSchema: preparerQualifications2.uiSchema,
          schema: preparerQualifications2.schema,
        },
      },
    },
    veteranPersonalInformationChapter: {
      title: 'Veteran’s personal information',
      pages: {
        veteranPersonalInformation: {
          path: 'veteran-personal-information',
          title: 'Veteran’s personal information',
          uiSchema: veteranPersonalInformation.uiSchema,
          schema: veteranPersonalInformation.schema,
        },
      },
    },
    veteranIdentificationInformationChapter: {
      title: 'Veteran’s identification information',
      pages: {
        veteranIdentificationInformation1: {
          path: 'veteran-identification-information-1',
          title: 'VA claim status',
          uiSchema: veteranIdentificationInformation1.uiSchema,
          schema: veteranIdentificationInformation1.schema,
        },
        veteranIdentificationInformation2: {
          path: 'veteran-identification-information-2',
          title: 'Identity verification',
          uiSchema: veteranIdentificationInformation2.uiSchema,
          schema: veteranIdentificationInformation2.schema,
        },
      },
    },
    additionalInformationChapter: {
      title: 'Additional information',
      pages: {
        additionalInformation: {
          path: 'additional-information',
          title: 'Additional information',
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
