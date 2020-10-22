import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import FormButtons from '../../components/FormButtons';
import { LANGUAGES } from './../../utils/constants';

import {
  openCommunityCarePreferencesPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';
import { getFormPageInfo } from '../../utils/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { createSelector } from 'reselect';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import { validateWhiteSpace } from 'platform/forms/validations';

import { states, isValidUSZipCode } from 'platform/forms/address';

function validateAddress(errors, addr) {
  validateWhiteSpace(errors.street, addr.street);
  validateWhiteSpace(errors.city, addr.city);

  const hasAddressInfo =
    typeof addr.street !== 'undefined' &&
    typeof addr.city !== 'undefined' &&
    typeof addr.postalCode !== 'undefined';

  if (hasAddressInfo && typeof addr.state === 'undefined') {
    errors.state.addError(
      'Please enter a state, or remove other address information.',
    );
  }

  const isValidPostalCode = isValidUSZipCode(addr.postalCode);

  // Add error message for postal code if it is invalid
  if (addr.postalCode && !isValidPostalCode) {
    errors.postalCode.addError('Please provide a valid postal code');
  }
}

const militaryStates = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.value);
const militaryLabels = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.label);
const usaStates = states.USA.map(state => state.value);
const usaLabels = states.USA.map(state => state.label);

function isMilitaryCity(city = '') {
  const lowerCity = city.toLowerCase().trim();

  return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
}

export const addressSchema = {
  type: 'object',
  properties: {
    street: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
      pattern: '^.*\\S.*',
    },
    street2: {
      type: 'string',
      maxLength: 30,
    },
    state: {
      type: 'string',
      enum: usaStates,
      enumNames: usaLabels,
    },
    city: {
      type: 'string',
      minLength: 1,
      maxLength: 51,
      pattern: '^.*\\S.*',
    },
    postalCode: {
      type: 'string',
      maxLength: 10,
    },
  },
};

export function getAddressUISchema(label = '') {
  const fieldOrder = ['street', 'street2', 'city', 'state', 'postalCode'];

  const addressChangeSelector = createSelector(
    ({ formData, path }) => get(path.concat('city'), formData),
    (...args) => get('addrSchema', ...args),
    (city, addrSchema) => {
      const schemaUpdate = {
        properties: addrSchema.properties,
      };

      const stateList = usaStates;
      const labelList = usaLabels;

      // We constrain the state list when someone picks a city that’s a military base
      if (
        isMilitaryCity(city) &&
        schemaUpdate.properties.state.enum !== militaryStates
      ) {
        const withEnum = set(
          'state.enum',
          militaryStates,
          schemaUpdate.properties,
        );
        schemaUpdate.properties = set(
          'state.enumNames',
          militaryLabels,
          withEnum,
        );
      } else {
        schemaUpdate.properties = set(
          'state.enumNames',
          labelList,
          schemaUpdate.properties,
        );
        schemaUpdate.properties = set(
          'state.enum',
          stateList,
          schemaUpdate.properties,
        );
      }

      return schemaUpdate;
    },
  );

  return {
    'ui:title': label,
    'ui:validations': [validateAddress],
    'ui:options': {
      updateSchema: (formData, addrSchema, addressUiSchema, index, path) =>
        addressChangeSelector({
          formData,
          addrSchema,
          path,
        }),
    },
    'ui:order': fieldOrder,
    street: {
      'ui:title': 'Street',
    },
    street2: {
      'ui:title': 'Line 2',
    },
    city: {
      'ui:title': 'City',
    },
    state: {
      'ui:title': 'State',
    },
    postalCode: {
      'ui:title': 'Postal code',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
  };
}

const initialSchema = {
  type: 'object',
  required: ['preferredLanguage', 'hasCommunityCareProvider'],
  properties: {
    communityCareSystemId: {
      type: 'string',
      enum: [],
    },
    preferredLanguage: {
      type: 'string',
      enum: LANGUAGES.map(l => l.id),
      enumNames: LANGUAGES.map(l => l.text),
    },
    hasCommunityCareProvider: {
      type: 'boolean',
    },
    communityCareProvider: {
      type: 'object',
      properties: {
        practiceName: {
          type: 'string',
        },
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        address: addressSchema,
        phone: {
          type: 'string',
          minLength: 10,
          pattern: '^[0-9]{10}$',
        },
        'view:textObject': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};

const addressUISchema = getAddressUISchema();
const uiSchema = {
  communityCareSystemId: {
    'ui:title': 'What’s the closest city and state to you?',
    'ui:widget': 'radio',
  },
  preferredLanguage: {
    'ui:title':
      'Do you prefer that your community care provider speak a certain language?',
  },
  hasCommunityCareProvider: {
    'ui:widget': 'yesNo',
    'ui:options': {
      labels: {
        N: "No/I don't know",
      },
    },
  },
  communityCareProvider: {
    'ui:required': data => data.hasCommunityCareProvider,
    'ui:options': {
      expandUnder: 'hasCommunityCareProvider',
    },
    'ui:description': (
      <p className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-top--1">
        Use the{' '}
        <a
          href="/find-locations/?facilityType=cc_provider"
          target="_blank"
          rel="noopener noreferrer"
        >
          facility locator
        </a>{' '}
        to find your preferred community care provider. Copy and paste their
        name and address below.
      </p>
    ),
    practiceName: {
      'ui:title': 'Practice name',
    },
    firstName: {
      'ui:title': 'First name',
      'ui:required': data => data.hasCommunityCareProvider,
    },
    lastName: {
      'ui:title': 'Last name',
      'ui:required': data => data.hasCommunityCareProvider,
    },
    address: {
      ...addressUISchema,
      street: {
        ...addressUISchema.street,
        'ui:title': 'Mailing address line 1',
        'ui:required': data => data.hasCommunityCareProvider,
      },
      street2: {
        ...addressUISchema.street2,
        'ui:title': 'Mailing address line 2',
      },
      city: {
        ...addressUISchema.city,
        'ui:required': data => data.hasCommunityCareProvider,
      },
      state: {
        ...addressUISchema.state,
        'ui:required': data => data.hasCommunityCareProvider,
      },
      postalCode: {
        ...addressUISchema.postalCode,
        'ui:required': data => data.hasCommunityCareProvider,
      },
    },
    phone: {
      ...phoneUI(),
      'ui:required': data => data.hasCommunityCareProvider,
    },
    'view:textObject': {
      'ui:description': (
        <AlertBox
          status="info"
          headline="We’ll try to schedule your appointment with your preferred community provider"
        >
          If we aren’t able to schedule this appointment with your preferred
          provider, we’ll make every effort to schedule your appointment with
          another community provider closest to your home.
        </AlertBox>
      ),
    },
  },
};

const pageKey = 'ccPreferences';
const pageTitle = 'Tell us your community care preferences';

export class CommunityCarePreferencesPage extends React.Component {
  componentDidMount() {
    this.props.openCommunityCarePreferencesPage(
      pageKey,
      uiSchema,
      initialSchema,
    );
    document.title = `${pageTitle}  | Veterans Affairs`;
    scrollAndFocus();
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.history, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.history, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        {!!schema && (
          <SchemaForm
            name="ccPreferences"
            title="Community Care preferences"
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={this.goForward}
            onChange={newData =>
              this.props.updateFormData(pageKey, uiSchema, newData)
            }
            data={data}
          >
            <FormButtons
              onBack={this.goBack}
              pageChangeInProgress={pageChangeInProgress}
              loadingText="Page change in progress"
            />
          </SchemaForm>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...getFormPageInfo(state, pageKey),
    parentFacilitiesStatus: state.newAppointment.parentFacilitiesStatus,
  };
}

const mapDispatchToProps = {
  openCommunityCarePreferencesPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityCarePreferencesPage);
