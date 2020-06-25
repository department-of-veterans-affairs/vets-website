import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import createContactInformationPage from '../../pages/contactInformation';
import createDirectDepositChangePage from '../../pages/directDepositChange';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';

import { display10203StemFlow, displayStemEligibility } from '../helpers';

import {
  applicantInformation,
  activeDuty,
  benefitSelection,
  stem,
  stemEligibility,
} from '../pages';

export const chapters = {
  applicantInformation: {
    title: 'Applicant Information',
    pages: {
      applicantInformation: {
        ...createApplicantInformationPage(fullSchema10203, {
          isVeteran: true,
          fields: ['veteranFullName', 'veteranSocialSecurityNumber'],
          required: ['veteranFullName', 'veteranSocialSecurityNumber'],
        }),
        uiSchema: applicantInformation.uiSchema,
      },
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
      contactInformation: createContactInformationPage(fullSchema10203),
    },
  },
};
