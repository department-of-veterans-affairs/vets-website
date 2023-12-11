import get from '@department-of-veterans-affairs/platform-forms-system/get';
import merge from 'lodash/merge';
import moment from 'moment';

import ssnUI from '@department-of-veterans-affairs/platform-forms-system/ssn';
import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

import {
  dependentWarning,
  disabilityDocs,
  schoolAttendanceWarning,
} from '../../../helpers';

const { dependents } = fullSchemaPensions.properties;

function isBetween18And23(childDOB) {
  return moment(childDOB).isBetween(
    moment()
      .startOf('day')
      .subtract(23, 'years'),
    moment()
      .startOf('day')
      .subtract(18, 'years'),
  );
}

// Checks to see if they’re under 17.75 years old
function isEligibleForDisabilitySupport(childDOB) {
  return moment()
    .startOf('day')
    .subtract(17, 'years')
    .subtract(9, 'months')
    .isBefore(childDOB);
}

/** @type {PageSchema} */
export default {
  uiSchema: {
    dependents: {
      items: {
        'ui:title': createHouseholdMemberTitle('fullName', 'Information'),
        childPlaceOfBirth: {
          'ui:title': 'Place of birth (city and state or foreign country)',
        },
        childSocialSecurityNumber: merge({}, ssnUI, {
          'ui:title': 'Social Security number',
          'ui:required': (formData, index) =>
            !get(`dependents.${index}.noSSN`, formData),
        }),
        noSSN: {
          'ui:title': "Doesn't have a Social Security number",
        },
        childRelationship: {
          'ui:title': item =>
            `What's your relationship to
            ${item.fullName.first} ${item.fullName.last}?`,
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              biological: "They're my biological child",
              adopted: "They're my adopted child",
              stepchild: "They're my stepchild",
            },
          },
        },
        attendingCollege: {
          'ui:title': 'Is your child in school?',
          'ui:widget': 'yesNo',
          'ui:required': (formData, index) =>
            isBetween18And23(
              get(['dependents', index, 'childDateOfBirth'], formData),
            ),
          'ui:options': {
            hideIf: (formData, index) =>
              !isBetween18And23(
                get(['dependents', index, 'childDateOfBirth'], formData),
              ),
          },
        },
        'view:schoolWarning': {
          'ui:description': schoolAttendanceWarning,
          'ui:options': {
            expandUnder: 'attendingCollege',
          },
        },
        disabled: {
          'ui:title': 'Is your child seriously disabled?',
          'ui:required': (formData, index) =>
            !isEligibleForDisabilitySupport(
              get(['dependents', index, 'childDateOfBirth'], formData),
            ),
          'ui:options': {
            hideIf: (formData, index) =>
              isEligibleForDisabilitySupport(
                get(['dependents', index, 'childDateOfBirth'], formData),
              ),
          },
          'ui:widget': 'yesNo',
        },
        'view:disabilityDocs': {
          'ui:description': disabilityDocs,
          'ui:options': {
            expandUnder: 'disabled',
          },
        },
        'view:dependentWarning': {
          'ui:description': dependentWarning,
          'ui:options': {
            hideIf: (formData, index) =>
              get(['dependents', index, 'disabled'], formData) !== false ||
              get(['dependents', index, 'attendingCollege'], formData) !==
                false,
          },
        },
        previouslyMarried: yesNoUI('Has your child ever been married?'),
        married: merge(
          {},
          yesNoUI({
            title: 'Are they currently married?',
            expandUnder: 'previouslyMarried',
          }),
          {
            'ui:required': (formData, index) =>
              get(['dependents', index, 'previouslyMarried'], formData),
          },
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      dependents: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'childPlaceOfBirth',
            'childRelationship',
            'previouslyMarried',
          ],
          properties: {
            childPlaceOfBirth: dependents.items.properties.childPlaceOfBirth,
            childSocialSecurityNumber:
              dependents.items.properties.childSocialSecurityNumber,
            noSSN: yesNoSchema,
            childRelationship: dependents.items.properties.childRelationship,
            attendingCollege: dependents.items.properties.attendingCollege,
            schoolWarning: { type: 'object', properties: {} },
            disabled: dependents.items.properties.disabled,
            disabilityDocs: { type: 'object', properties: {} },
            dependentWarning: { type: 'object', properties: {} },
            previouslyMarried: dependents.items.properties.previouslyMarried,
            married: dependents.items.properties.married,
          },
        },
      },
    },
  },
};
