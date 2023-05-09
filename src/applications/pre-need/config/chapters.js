import * as veteranInformation from './pages/veteranInformation';
import * as applicantInformation from './pages/applicantInformation';
import * as sponsorInformation from './pages/sponsorInformation';
import * as applicantMilitaryHistory from './pages/applicantMilitaryHistory';
import * as applicantMilitaryName from './pages/applicantMilitaryName';
import * as sponsorMilitaryHistory from './pages/sponsorMilitaryHistory';
import * as sponsorMilitaryName from './pages/sponsorMilitaryName';
import * as burialBenefits from './pages/burialBenefits';
import * as supportingDocuments from './pages/supportingDocuments';
import * as applicantContactInformation from './pages/applicantContactInformation';
import * as sponsorMailingAddress from './pages/sponsorMailingAddress';
import * as preparer from './pages/preparer';

import { isVeteran } from '../utils/helpers';

export const chapters = {
  applicantInformation: {
    title: 'Applicant information',
    pages: {
      applicantInformation: {
        title: 'Applicant information',
        path: 'applicant-information',
        uiSchema: applicantInformation.uiSchema,
        schema: applicantInformation.schema,
      },
      veteranInformation: {
        path: 'veteran-applicant-information',
        title: 'Veteran Information',
        depends: isVeteran,
        uiSchema: veteranInformation.uiSchema,
        schema: veteranInformation.schema,
      },
    },
  },
  sponsorInformation: {
    title: 'Sponsor information',
    pages: {
      sponsorInformation: {
        path: 'sponsor-information',
        depends: formData => !isVeteran(formData),
        uiSchema: sponsorInformation.uiSchema,
        schema: sponsorInformation.schema,
      },
    },
  },
  militaryHistory: {
    title: 'Military history',
    pages: {
      // Two sets of military history pages dependent on
      // whether the applicant is the veteran or not.
      // If not, "Sponsor’s" precedes all the field labels.
      applicantMilitaryHistory: {
        path: 'applicant-military-history',
        depends: isVeteran,
        uiSchema: applicantMilitaryHistory.uiSchema,
        schema: applicantMilitaryHistory.schema,
      },
      applicantMilitaryName: {
        path: 'applicant-military-name',
        depends: isVeteran,
        uiSchema: applicantMilitaryName.uiSchema,
        schema: applicantMilitaryName.schema,
      },
      sponsorMilitaryHistory: {
        path: 'sponsor-military-history',
        depends: formData => !isVeteran(formData),
        uiSchema: sponsorMilitaryHistory.uiSchema,
        schema: sponsorMilitaryHistory.schema,
      },
      sponsorMilitaryName: {
        path: 'sponsor-military-name',
        depends: formData => !isVeteran(formData),
        uiSchema: sponsorMilitaryName.uiSchema,
        schema: sponsorMilitaryName.schema,
      },
    },
  },
  burialBenefits: {
    title: 'Burial benefits',
    pages: {
      burialBenefits: {
        path: 'burial-benefits',
        uiSchema: burialBenefits.uiSchema,
        schema: burialBenefits.schema,
      },
    },
  },
  supportingDocuments: {
    title: 'Supporting documents',
    pages: {
      supportingDocuments: {
        path: 'supporting-documents',
        editModeOnReviewPage: true,
        uiSchema: supportingDocuments.uiSchema,
        schema: supportingDocuments.schema,
      },
    },
  },
  contactInformation: {
    title: 'Contact information',
    pages: {
      applicantContactInformation: {
        title: 'Applicant’s contact information',
        path: 'applicant-contact-information',
        uiSchema: applicantContactInformation.uiSchema,
        schema: applicantContactInformation.schema,
      },
      sponsorMailingAddress: {
        title: 'Sponsor’s mailing address',
        path: 'sponsor-mailing-address',
        depends: formData => !isVeteran(formData),
        uiSchema: sponsorMailingAddress.uiSchema,
        schema: sponsorMailingAddress.schema,
      },
      preparer: {
        title: 'Preparer',
        path: 'preparer',
        uiSchema: preparer.uiSchema,
        schema: preparer.schema,
      },
    },
  },
};
