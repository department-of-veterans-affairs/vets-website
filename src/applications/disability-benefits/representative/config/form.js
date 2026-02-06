import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';

import RepIntroductionPage from '../components/RepIntroductionPage';
import RepConfirmationPage from '../components/RepConfirmationPage';
import GetFormHelp from '../../components/GetFormHelp';
import { transform } from './transformer';

import manifest from '../manifest.json';

// Import local pages
import * as veteranIdentification from '../pages/veteranIdentification';
import * as contactInformation from '../pages/contactInformation';
import * as addDisabilities from '../pages/addDisabilities';
import * as evidenceTypes from '../pages/evidenceTypes';

/**
 * Form configuration for the Representative 526EZ form
 *
 * This form is used by accredited representatives to file disability
 * compensation claims on behalf of veterans.
 *
 * Key differences from the veteran-facing form:
 * - No prefill (representative isn't the veteran)
 * - Veteran identification chapter to collect veteran's info
 * - Simplified chapters for PoC
 * - Different submit endpoint for representatives
 *
 * @type {FormConfig}
 */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${
    environment.API_URL
  }/accredited_representative_portal/v0/disability_compensation_form/submit_all_claim`,
  trackingPrefix: 'disability-526EZ-representative-',
  formId: VA_FORM_IDS.FORM_21_526EZ,
  transformForSubmit: transform,

  // Form metadata
  version: 0,
  prefillEnabled: false, // Rep isn't the veteran, no prefill

  // Page components
  introduction: RepIntroductionPage,
  confirmation: RepConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,

  // Form title
  title: 'File a disability compensation claim for a veteran',
  subTitle: 'VA Form 21-526EZ (Representative)',

  // Default definitions from schema
  defaultDefinitions: {},

  // Form chapters
  chapters: {
    // Chapter 1: Veteran Identification
    // This is a NEW chapter specific to the representative form
    veteranIdentification: {
      title: 'Veteran information',
      pages: {
        veteranIdentification: {
          title: 'Veteran identification',
          path: 'veteran-identification',
          uiSchema: veteranIdentification.uiSchema,
          schema: veteranIdentification.schema,
        },
      },
    },

    // Chapter 2: Contact Information
    contactInformation: {
      title: 'Contact information',
      pages: {
        contactInformation: {
          title: 'Mailing address and contact information',
          path: 'contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },

    // Chapter 3: Conditions
    disabilities: {
      title: 'Conditions',
      pages: {
        addDisabilities: {
          title: 'Add conditions',
          path: 'disabilities/add',
          uiSchema: addDisabilities.uiSchema,
          schema: addDisabilities.schema,
        },
      },
    },

    // Chapter 4: Supporting Evidence
    supportingEvidence: {
      title: 'Supporting evidence',
      pages: {
        evidenceTypes: {
          title: 'Evidence types',
          path: 'supporting-evidence/types',
          uiSchema: evidenceTypes.uiSchema,
          schema: evidenceTypes.schema,
        },
      },
    },
  },
};

export default formConfig;
