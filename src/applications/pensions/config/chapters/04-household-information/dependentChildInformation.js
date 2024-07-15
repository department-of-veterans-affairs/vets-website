import merge from 'lodash/merge';
import {
  radioSchema,
  radioUI,
  ssnSchema,
  ssnUI,
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaCheckboxField,
  VaTextInputField,
} from 'platform/forms-system/src/js/web-component-fields';
import get from 'platform/utilities/data/get';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';
import {
  DependentSeriouslyDisabledDescription,
  showDependentsMultiplePage,
} from '../../../helpers';
import {
  DisabilityDocsAlert,
  SchoolAttendanceAlert,
  AdoptionEvidenceAlert,
} from '../../../components/FormAlerts';
import { childRelationshipLabels } from '../../../labels';
import {
  doesHaveDependents,
  getDependentChildTitle,
  isBetween18And23,
} from './helpers';

const {
  childPlaceOfBirth,
  attendingCollege,
  disabled,
  previouslyMarried,
  married,
} = fullSchemaPensions.properties.dependents.items.properties;

/** @type {PageSchema} */
export default {
  title: item => getDependentChildTitle(item, 'information'),
  path: 'household/dependents/children/information/:index',
  depends: formData =>
    !showDependentsMultiplePage() && doesHaveDependents(formData),
  showPagePerItem: true,
  arrayPath: 'dependents',
  uiSchema: {
    dependents: {
      items: {
        ...titleUI(createHouseholdMemberTitle('fullName', 'information')),
        childPlaceOfBirth: {
          'ui:title': 'Place of birth (city and state or foreign country)',
          'ui:webComponentField': VaTextInputField,
        },
        childSocialSecurityNumber: merge({}, ssnUI(), {
          'ui:required': (formData, index) =>
            !get(['dependents', index, 'view:noSSN'], formData),
        }),
        'view:noSSN': {
          'ui:title': "Doesn't have a Social Security number",
          'ui:webComponentField': VaCheckboxField,
        },
        childRelationship: radioUI({
          title: "What's your relationship?",
          labels: childRelationshipLabels,
        }),
        'view:adoptionDocs': {
          'ui:description': AdoptionEvidenceAlert,
          'ui:options': {
            expandUnder: 'childRelationship',
            expandUnderCondition: 'ADOPTED',
          },
        },
        attendingCollege: yesNoUI({
          title: 'Is your child in school?',
          hideIf: (formData, index) =>
            !isBetween18And23(
              get(['dependents', index, 'childDateOfBirth'], formData),
            ),
          required: (formData, index) =>
            isBetween18And23(
              get(['dependents', index, 'childDateOfBirth'], formData),
            ),
        }),
        'view:schoolWarning': {
          'ui:description': SchoolAttendanceAlert,
          'ui:options': {
            expandUnder: 'attendingCollege',
          },
        },
        disabled: yesNoUI({
          title: 'Is your child seriously disabled?',
          required: (formData, index) =>
            get(['dependents', index, 'childDateOfBirth'], formData),
        }),
        'view:disabilityDocs': {
          'ui:description': DisabilityDocsAlert,
          'ui:options': {
            expandUnder: 'disabled',
          },
        },
        'view:disabilityInformation': {
          'ui:description': DependentSeriouslyDisabledDescription,
        },
        previouslyMarried: yesNoUI({
          title: 'Has your child ever been married?',
        }),
        married: yesNoUI({
          title: 'Are they currently married?',
          expandUnder: 'previouslyMarried',
          required: (formData, index) =>
            get(['dependents', index, 'previouslyMarried'], formData),
        }),
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
            childPlaceOfBirth,
            childSocialSecurityNumber: ssnSchema,
            'view:noSSN': { type: 'boolean' },
            childRelationship: radioSchema(
              Object.keys(childRelationshipLabels),
            ),
            'view:adoptionDocs': { type: 'object', properties: {} },
            attendingCollege,
            'view:schoolWarning': { type: 'object', properties: {} },
            disabled,
            'view:disabilityDocs': { type: 'object', properties: {} },
            'view:disabilityInformation': { type: 'object', properties: {} },
            previouslyMarried,
            married,
          },
        },
      },
    },
  },
};
