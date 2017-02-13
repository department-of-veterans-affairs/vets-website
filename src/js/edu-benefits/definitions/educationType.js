import _ from 'lodash/fp';
import { enumToNames } from '../utils/helpers.js';

import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';

const educationTypeLabels = {
  college: 'College, university, or other educational program, including online courses',
  correspondence: 'Correspondence',
  apprenticeship: 'Apprenticeship or on-the-job training',
  flightTraining: 'Vocational fight training',
  testReimbursement: 'National test reimbursement (for example, SAT or CLEP)',
  licensingReimbursement: 'Licensing or certification test reimbursement (for example, MCSE, CCNA, EMT, or NCLEX)',
  tuitionTopUp: 'Tuition assistance top up (Post 9/11 GI Bill and MGIB-AD only)',
  cooperativeTraining: 'Cooperative training'
};

const educationType = fullSchema1995.definitions.educationType;

export const schema = _.assign(educationType, {
  enumNames: enumToNames(educationType.enum, educationTypeLabels)
});

const enumWithoutTopUp = schema.enum.filter(type => type !== 'tuitionTopUp');

const schemaWithoutTopUp = _.assign(educationType, {
  'enum': enumWithoutTopUp,
  enumNames: enumToNames(enumWithoutTopUp, educationTypeLabels)
});

export const uiSchema = {
  'ui:title': 'Type of education or training',
  'ui:options': {
    updateSchema: (field, form) => {
      if (_.includes(form.benefitSelection.data.benefit, ['chapter30', 'chapter33'])) {
        return schema;
      }

      return schemaWithoutTopUp;
    }
  }
};
