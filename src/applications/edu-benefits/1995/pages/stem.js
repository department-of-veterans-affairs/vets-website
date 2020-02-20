import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import {
  rogersStemScholarshipInfo,
  exhaustionOfBenefitsTitle,
} from '../content/stem';
import _ from 'lodash';

const {
  isEdithNourseRogersScholarship,
  isEnrolledStem,
  isPursuingTeachingCert,
} = fullSchema1995.properties;

export const uiSchema = {
  'ui:title': 'Rogers STEM Scholarship',
  'view:rogersStemScholarshipInfo': {
    'ui:description': rogersStemScholarshipInfo,
  },
  isEdithNourseRogersScholarship: {
    'ui:title': 'Are you applying for the Rogers STEM Scholarship?',
    'ui:widget': 'yesNo',
  },
  isEnrolledStem: {
    'ui:title':
      'Are you enrolled in a science, technology, engineering, or math (STEM) undergraduate degree program?',
    'ui:widget': 'yesNo',
    'ui:required': form => form.isEdithNourseRogersScholarship,
    'ui:options': {
      expandUnder: 'isEdithNourseRogersScholarship',
    },
  },
  'view:exhaustionOfBenefits': {
    'ui:title': exhaustionOfBenefitsTitle,
    'ui:widget': 'yesNo',
    'ui:required': form =>
      form.isEdithNourseRogersScholarship && form.isEnrolledStem,
    'ui:options': {
      expandUnder: 'isEdithNourseRogersScholarship',
      hideIf: formData => !_.get(formData, 'isEnrolledStem', false),
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
  'view:exhaustionOfBenefitsAfterPursuingTeachingCert': {
    'ui:title': exhaustionOfBenefitsTitle,
    'ui:widget': 'yesNo',
    'ui:required': form =>
      form.isEdithNourseRogersScholarship && !form.isEnrolledStem,
    'ui:options': {
      expandUnder: 'isEdithNourseRogersScholarship',
      hideIf: formData =>
        _.get(formData, 'isEnrolledStem', true) ||
        (!_.get(formData, 'isPursuingTeachingCert', false) &&
          _.get(formData, 'isPursuingTeachingCert', true)), // this causes question to show if isPursuingTeachingCert is answered
    },
  },
};

export const schema = {
  type: 'object',
  required: ['isEdithNourseRogersScholarship'],
  properties: {
    'view:rogersStemScholarshipInfo': {
      type: 'object',
      properties: {},
    },
    isEdithNourseRogersScholarship,
    isEnrolledStem,
    'view:exhaustionOfBenefits': {
      type: 'boolean',
    },
    isPursuingTeachingCert,
    'view:exhaustionOfBenefitsAfterPursuingTeachingCert': {
      type: 'boolean',
    },
  },
};
