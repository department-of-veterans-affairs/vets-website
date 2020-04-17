import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import serviceBefore1977UI from '../../definitions/serviceBefore1977';

import createDirectDepositChangePage from '../../pages/directDepositChange';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';

import { display10203StemFlow, displayStemEligibility } from '../helpers';

import { activeDuty, benefitSelection, stem, stemEligibility } from '../pages';

const { serviceBefore1977 } = fullSchema1995.definitions;

export const chapters = {
  applicantInformation: {
    title: 'Applicant Information',
    pages: {
      applicantInformation: createApplicantInformationPage(fullSchema1995, {
        isVeteran: true,
        fields: [
          'veteranFullName',
          'veteranSocialSecurityNumber',
          'view:noSSN',
          'vaFileNumber',
        ],
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
      // related to 1995-STEM
      stem: {
        title: 'Rogers STEM Scholarship',
        path: 'benefits/stem',
        uiSchema: stem.uiSchema,
        schema: stem.schema,
      },
      // related to 1995-STEM
      stemEligibility: {
        title: 'Rogers STEM Scholarship eligibility',
        path: 'benefits/stem-eligibility',
        pageClass: 'vads-u-max-width--100 vads-u-vads-u-width--full',
        depends: form => displayStemEligibility(form), // 1995-STEM related
        uiSchema: stemEligibility.uiSchema,
        schema: stemEligibility.schema,
      },
    },
  },
  militaryService: {
    title: 'Military History',
    pages: {
      // 1995-STEM related
      activeDuty: {
        title: 'Active Duty',
        path: 'active-duty',
        depends: display10203StemFlow, // 1995-STEM related
        uiSchema: activeDuty.uiSchema,
        schema: activeDuty.schema,
      },
    },
  },
  personalInformation: {
    title: 'Personal Information',
    pages: {
      dependents: {
        title: 'Dependents',
        path: 'personal-information/dependents',
        depends: form =>
          !display10203StemFlow(form) &&
          form['view:hasServiceBefore1978'] === true,
        uiSchema: {
          serviceBefore1977: serviceBefore1977UI,
        },
        schema: {
          type: 'object',
          properties: {
            serviceBefore1977,
          },
        },
      },
      directDeposit: createDirectDepositChangePage(fullSchema1995),
    },
  },
};
