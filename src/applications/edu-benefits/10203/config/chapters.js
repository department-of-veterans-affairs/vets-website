import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';

import { display10203StemFlow, displayStemEligibility } from '../helpers';

import {
  activeDuty,
  benefitSelection,
  personalInformation,
  stem,
  stemEligibility,
} from '../pages';

export const chapters = {
  applicantInformation: {
    title: 'Applicant Information',
    pages: {
      applicantInformation: createApplicantInformationPage(fullSchema10203, {
        isVeteran: true,
        fields: ['veteranFullName', 'veteranSocialSecurityNumber'],
        required: ['veteranFullName'],
      }),
    },
  },
  benefitSelection: {
    title: 'Education Benefit',
    pages: {
      benefitSelection: {
        title: 'Education benefit selection',
        path: 'benefits/eligibility',
        uiSchema: benefitSelection.uiSchema,
        schema: benefitSelection.schema,
      },
      stem: {
        title: 'Rogers STEM Scholarship',
        path: 'benefits/stem',
        uiSchema: stem.uiSchema,
        schema: stem.schema,
      },
      stemEligibility: {
        title: 'Rogers STEM Scholarship eligibility',
        path: 'benefits/stem-eligibility',
        pageClass: 'vads-u-max-width--100 vads-u-vads-u-width--full',
        depends: form => displayStemEligibility(form),
        uiSchema: stemEligibility.uiSchema,
        schema: stemEligibility.schema,
      },
    },
  },
  militaryService: {
    title: 'Military History',
    pages: {
      activeDuty: {
        title: 'Active Duty',
        path: 'active-duty',
        depends: display10203StemFlow,
        uiSchema: activeDuty.uiSchema,
        schema: activeDuty.schema,
      },
    },
  },
  personalInformation: {
    title: 'Personal Information',
    pages: {
      contactInformation: {
        title: personalInformation.title,
        path: personalInformation.path,
        uiSchema: personalInformation.uiSchema,
        schema: personalInformation.schema,
      },
    },
  },
};
