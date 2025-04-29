import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';
import { displayConfirmEligibility, isChapter33 } from '../helpers';
import captureEvents from '../analytics-functions';
import createDirectDepositPage10203 from '../pages/DirectDeposit';
import { updateApplicantInformationPage } from '../../utils/helpers';

import {
  activeDuty,
  applicantInformation,
  benefitSelection,
  confirmEligibility,
  initialConfirmEligibility,
  stemEligibility,
  personalInformation,
  programDetails,
} from '../pages';

export const chapters = {
  applicantInformation: {
    title: 'Applicant information',
    pages: {
      applicantInformation: updateApplicantInformationPage({
        ...createApplicantInformationPage(fullSchema10203, {
          isVeteran: true,
          fields: ['veteranFullName', 'veteranSocialSecurityNumber'],
          required: ['veteranFullName', 'veteranSocialSecurityNumber'],
        }),
        uiSchema: applicantInformation.uiSchema,
      }),
    },
  },
  benefitSelection: {
    title: 'Education benefit',
    pages: {
      benefitSelection: {
        title: 'Education benefit selection',
        path: 'benefits/eligibility',
        uiSchema: benefitSelection.uiSchema,
        schema: benefitSelection.schema,
        onContinue: captureEvents.currentlyUsedBenefits,
      },
      initialConfirmEligibility: {
        title: '',
        path: 'benefits/initial-confirm-eligibility',
        depends: form => !isChapter33(form),
        pageClass: 'vads-u-max-width--100 vads-u-vads-u-width--full',
        uiSchema: initialConfirmEligibility.uiSchema,
        schema: initialConfirmEligibility.schema,
      },
    },
  },
  programDetails: {
    title: 'Program details',
    pages: {
      stemEligibility: {
        title: 'STEM Scholarship eligibility',
        path: 'benefits/stem-eligibility',
        uiSchema: stemEligibility.uiSchema,
        schema: stemEligibility.schema,
      },
      confirmEligibility: {
        title: 'Rogers STEM Scholarship eligibility summary',
        path: 'benefits/confirm-eligibility',
        depends: displayConfirmEligibility,
        pageClass: 'vads-u-max-width--100 vads-u-vads-u-width--full',
        uiSchema: confirmEligibility.uiSchema,
        schema: confirmEligibility.schema,
        hideHeaderRow: true,
      },
      // prod flag 24612
      programDetails: {
        title: 'STEM degree and institution details',
        path: 'benefits/program-details',
        uiSchema: programDetails.uiSchema,
        schema: programDetails.schema,
      },
    },
  },
  militaryService: {
    title: 'Military details',
    pages: {
      activeDuty: {
        title: 'Active Duty',
        path: 'active-duty',
        uiSchema: activeDuty.uiSchema,
        schema: activeDuty.schema,
      },
    },
  },
  personalInformation: {
    title: 'Personal information',
    pages: {
      contactInformation: {
        title: personalInformation.title,
        path: personalInformation.path,
        uiSchema: personalInformation.uiSchema,
        schema: personalInformation.schema,
      },
      directDeposit: createDirectDepositPage10203(),
    },
  },
};
