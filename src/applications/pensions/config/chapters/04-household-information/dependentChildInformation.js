import get from 'platform/utilities/data/get';
import merge from 'lodash/merge';
import moment from 'moment';

import {
  radioSchema,
  radioUI,
  ssnSchema,
  ssnUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

import { DependentSeriouslyDisabledDescription } from '../../../helpers';
import {
  DisabilityDocsAlert,
  SchoolAttendanceAlert,
} from '../../../components/FormAlerts';

const { dependents } = fullSchemaPensions.properties;

const childRelationshipOptions = {
  BIOLOGICAL: "They're my biological child",
  ADOPTED: "They're my adopted child",
  STEP_CHILD: "They're my stepchild",
};

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
        ...titleUI(createHouseholdMemberTitle('fullName', 'information')),
        childPlaceOfBirth: {
          'ui:title': 'Place of birth (city and state or foreign country)',
        },
        childSocialSecurityNumber: merge({}, ssnUI(), {
          'ui:required': (formData, index) =>
            !get(['dependents', index, 'view:noSSN'], formData),
        }),
        'view:noSSN': {
          'ui:title': "Doesn't have a Social Security number",
        },
        childRelationship: radioUI({
          title: "What's your relationship?",
          labels: childRelationshipOptions,
        }),
        attendingCollege: merge(
          {},
          yesNoUI({
            title: 'Is your child in school?',
            hideIf: (formData, index) =>
              !isBetween18And23(
                get(['dependents', index, 'childDateOfBirth'], formData),
              ),
          }),
          {
            'ui:required': (formData, index) =>
              isBetween18And23(
                get(['dependents', index, 'childDateOfBirth'], formData),
              ),
          },
        ),
        'view:schoolWarning': {
          'ui:description': SchoolAttendanceAlert,
          'ui:options': {
            expandUnder: 'attendingCollege',
          },
        },
        // unable to use yesNoUI, because description is not being respected
        disabled: {
          'ui:title': 'Is your child seriously disabled?',
          'ui:description': DependentSeriouslyDisabledDescription,
          'ui:required': (formData, index) =>
            isEligibleForDisabilitySupport(
              get(['dependents', index, 'childDateOfBirth'], formData),
            ),
          'ui:options': {
            hideIf: (formData, index) =>
              !isEligibleForDisabilitySupport(
                get(['dependents', index, 'childDateOfBirth'], formData),
              ),
          },
          'ui:widget': 'yesNo',
        },
        'view:disabilityDocs': {
          'ui:description': DisabilityDocsAlert,
          'ui:options': {
            expandUnder: 'disabled',
          },
        },
        previouslyMarried: yesNoUI({
          title: 'Has your child ever been married?',
        }),
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
            childSocialSecurityNumber: ssnSchema,
            'view:noSSN': { type: 'boolean' },
            childRelationship: radioSchema(
              Object.keys(childRelationshipOptions),
            ),
            attendingCollege: yesNoSchema,
            'view:schoolWarning': { type: 'object', properties: {} },
            disabled: yesNoSchema,
            'view:disabilityDocs': { type: 'object', properties: {} },
            previouslyMarried: yesNoSchema,
            married: yesNoSchema,
          },
        },
      },
    },
  },
};
