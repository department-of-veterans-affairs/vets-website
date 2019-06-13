import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import { rogersStemScholarshipInfo } from '../content/stem';
import _ from 'lodash';

const {
  isEdithNourseRogersScholarship,
  isEnrolledStem,
  isPursuingTeachingCert,
} = fullSchema1995.properties;

export const uiSchema = {
  isEdithNourseRogersScholarship: {
    'ui:title':
      'Are you applying for the Edith Nourse Rogers STEM Scholarship (Chapter 33)?',
    'ui:widget': 'yesNo',
  },
  isEnrolledStem: {
    'ui:title': 'Are you enrolled in an undergraduate STEM degree program?',
    'ui:widget': 'yesNo',
    'ui:required': form => form.isEdithNourseRogersScholarship,
    'ui:options': {
      expandUnder: 'isEdithNourseRogersScholarship',
    },
  },
  isPursuingTeachingCert: {
    'ui:title':
      'Do you have a STEM undergraduate degree and are now pursuing a teaching certification?',
    'ui:widget': 'yesNo',
    'ui:required': form =>
      form.isEdithNourseRogersScholarship && !form.isEnrolledStem,
    'ui:options': {
      expandUnder: 'isEdithNourseRogersScholarship',
      hideIf: formData => _.get(formData, 'isEnrolledStem', true),
    },
  },
  'view:rogersStemScholarshipInfo': {
    'ui:description': rogersStemScholarshipInfo,
  },
};

export const schema = {
  type: 'object',
  required: ['isEdithNourseRogersScholarship'],
  properties: {
    isEdithNourseRogersScholarship,
    isEnrolledStem,
    isPursuingTeachingCert,
    'view:rogersStemScholarshipInfo': {
      type: 'object',
      properties: {},
    },
  },
};
