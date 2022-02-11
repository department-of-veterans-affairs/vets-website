import constants from 'vets-json-schema/dist/constants.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';

const validateAtLeastOneSelected = (errors, fieldData, formData) => {
  if (
    formData.reasonForRemoval === 'reportDeath' &&
    !Object.values(fieldData).some(val => val === true)
  ) {
    errors.addError('Please select at least one option');
  }
};

const PATTERNS = {
  date: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
  STREET_PATTERN: '^.*\\S.*',
};

// filtered states that include US territories
const filteredStates = constants.states.USA.filter(
  state => !['AA', 'AE', 'AP'].includes(state.value),
);

const locationSchema = {
  type: 'object',
  properties: {
    isOutsideUs: {
      type: 'boolean',
      default: false,
    },
    state: {
      type: 'string',
      enum: filteredStates.map(state => state.value),
      enumNames: filteredStates.map(state => state.label),
    },
    city: {
      type: 'string',
      maxLength: 30,
    },
  },
};

const locationUiSchema = uiRequiredCallback => {
  return {
    isOutsideUs: {
      'ui:title': 'This happened outside of the U.S.',
    },
    state: {
      'ui:required': uiRequiredCallback,
      'ui:errorMessages': {
        required: 'Please select where this happened',
      },
      'ui:options': {
        replaceSchema: formData => {
          if (formData?.location?.isOutsideUs) {
            return {
              type: 'string',
              title: 'Country where this happened',
              enum: constants.countries
                .filter(country => country.value !== 'USA')
                .map(country => country.value),
              enumNames: constants.countries
                .filter(country => country.label !== 'United States')
                .map(country => country.label),
            };
          }
          return {
            type: 'string',
            title: 'State where this happened',
            enum: filteredStates.map(state => state.value),
            enumNames: filteredStates.map(state => state.label),
          };
        },
      },
    },
    city: {
      'ui:title': 'City where this happened',
      'ui:required': uiRequiredCallback,
      'ui:errorMessages': {
        required: 'Please enter a city',
      },
    },
  };
};

const isNotRemovingStepchild = value => {
  const removalReasonArray = [
    'reportDeath',
    'reportMarriageOfChildUnder18',
    'reportChild18OrOlderIsNotAttendingSchool',
  ];
  return value && removalReasonArray.indexOf(value) > -1;
};

const checkBoxTitle =
  'This is on a United States military base outside of the U.S.';

export const SCHEMAS = {
  Spouse: {
    schema: {
      type: 'object',
      required: ['reasonMarriageEnded', 'date'],
      properties: {
        reasonMarriageEnded: {
          type: 'string',
          enum: ['DIVORCE', 'ANNULMENT', 'VOID', 'DEATH'],
          enumNames: [
            'Divorce',
            'Annulment',
            'Declared Void',
            'Spouse’s Death',
          ],
        },
        date: {
          type: 'string',
          pattern: PATTERNS.date,
        },
        location: locationSchema,
      },
    },
    uiSchema: {
      reasonMarriageEnded: {
        'ui:title': 'Reason marriage ended:',
        'ui:widget': 'radio',
        'ui:errorMessages': {
          required: 'Please select an option',
        },
      },
      date: {
        ...currentOrPastDateUI('Date marriage ended'),
        'ui:errorMessages': {
          pattern: 'Please enter a valid current or past date',
          required: 'Please provide the date marriage ended',
        },
      },
      location: locationUiSchema(() => true),
    },
  },
  Parent: {
    schema: {
      type: 'object',
      required: ['reasonForRemoval', 'date'],
      properties: {
        reasonForRemoval: {
          type: 'string',
          enum: ['LEFTHOUSEHOLD', 'DEATH'],
          enumNames: ['Dependent has left household', 'Dependent’s death'],
        },
        date: {
          type: 'string',
          pattern: PATTERNS.date,
        },
        location: locationSchema,
      },
    },
    uiSchema: {
      reasonForRemoval: {
        'ui:title': 'Reason for removing dependent:',
        'ui:widget': 'radio',
        'ui:errorMessages': {
          required: 'Please select an option',
        },
      },
      date: currentOrPastDateUI('Date this happened'),
      location: locationUiSchema(() => true),
    },
  },
  Child: {
    schema: {
      type: 'object',
      required: ['reasonForRemoval', 'date'],
      properties: {
        reasonForRemoval: {
          type: 'string',
          enum: [
            'reportStepchildNotInHousehold',
            'reportMarriageOfChildUnder18',
            'reportChild18OrOlderIsNotAttendingSchool',
            'reportDeath',
          ],
          enumNames: [
            'Dependent stepchild has left household',
            'Dependent under 18 has married',
            'Dependent 18 or older has stopped attending school',
            'Dependents’s death',
          ],
        },
        date: {
          type: 'string',
          pattern: PATTERNS.date,
        },
        location: locationSchema,
        livingExpensesPaid: {
          type: 'string',
          enum: ['None', 'More than half', 'Half', 'Less than half'],
        },
        whoDoesTheStepchildLiveWith: {
          type: 'object',
          properties: {
            first: {
              type: 'string',
              minLength: 1,
              maxLength: 30,
            },
            last: {
              type: 'string',
              minLength: 1,
              maxLength: 30,
            },
          },
        },
        address: {
          type: 'object',
          properties: {
            isMilitary: {
              type: 'boolean',
            },
            country: {
              type: 'string',
              enum: constants.countries.map(country => country.value),
              enumNames: constants.countries.map(country => country.label),
            },
            'view:militaryBaseDescription': {
              type: 'object',
              properties: {},
            },
            street: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              pattern: PATTERNS.STREET_PATTERN,
            },
            street2: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              pattern: PATTERNS.STREET_PATTERN,
            },
            street3: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              pattern: PATTERNS.STREET_PATTERN,
            },
            city: {
              type: 'string',
            },
            state: {
              type: 'string',
            },
            postalCode: {
              type: 'string',
            },
          },
        },
        childStatus: {
          type: 'object',
          properties: {
            childUnder18: { type: 'boolean' },
            stepChild: { type: 'boolean' },
            adopted: { type: 'boolean' },
            disabled: { type: 'boolean' },
            childOver18InSchool: { type: 'boolean' },
          },
        },
      },
    },
    uiSchema: {
      reasonForRemoval: {
        'ui:title': 'Reason for removing this dependent',
        'ui:widget': 'radio',
        'ui:errorMessages': {
          required: 'Please select an option',
        },
      },
      date: currentOrPastDateUI('Date this happened'),
      location: {
        'ui:options': {
          hideIf: formData =>
            !isNotRemovingStepchild(formData.reasonForRemoval),
        },
        ...locationUiSchema(formData =>
          isNotRemovingStepchild(formData.reasonForRemoval),
        ),
      },
      livingExpensesPaid: {
        'ui:title': 'How much of this stepchild’s living expenses do you pay?',
        'ui:widget': 'radio',
        'ui:required': formData =>
          formData.reasonForRemoval === 'reportStepchildNotInHousehold',
        'ui:options': {
          hideIf: formData =>
            formData.reasonForRemoval !== 'reportStepchildNotInHousehold',
        },
      },
      whoDoesTheStepchildLiveWith: {
        'ui:title': 'Who does this stepchild live with now?',
        'ui:options': {
          hideIf: formData =>
            formData.reasonForRemoval !== 'reportStepchildNotInHousehold',
        },
        first: {
          'ui:title': 'First name',
          'ui:required': formData =>
            formData.reasonForRemoval === 'reportStepchildNotInHousehold',
        },
        last: {
          'ui:title': 'Last name',
          'ui:required': formData =>
            formData.reasonForRemoval === 'reportStepchildNotInHousehold',
        },
      },
      address: {
        'ui:title': 'Stepchild’s new address',
        'ui:options': {
          hideIf: formData =>
            formData.reasonForRemoval !== 'reportStepchildNotInHousehold',
        },
        ...addressUiSchema(
          'address',
          checkBoxTitle,
          formData =>
            formData.reasonForRemoval === 'reportStepchildNotInHousehold',
        ),
      },
      childStatus: {
        'ui:title': 'Child’s status (Check all that apply)',
        'ui:required': formData => formData.reasonForRemoval === 'reportDeath',
        'ui:options': {
          hideIf: formData => formData.reasonForRemoval !== 'reportDeath',
          showFieldLabel: true,
        },
        'ui:validations': [validateAtLeastOneSelected],
        childUnder18: {
          'ui:title': 'Child under 18',
        },
        stepChild: {
          'ui:title': 'Stepchild',
        },
        adopted: {
          'ui:title': 'Adopted child',
        },
        disabled: {
          'ui:title': 'Child incapable of self-support',
        },
        childOver18InSchool: {
          'ui:title': 'Child 18-23 and in school',
        },
      },
    },
  },
};
