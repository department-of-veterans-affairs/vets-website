import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import FormButtons from '../../components/FormButtons';
import { LANGUAGES } from '../../utils/constants';
import * as actions from '../redux/actions';
import { getFormPageInfo } from '../../utils/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { addressSchema, getAddressUISchema } from '../fields/addressFields';
import { useHistory } from 'react-router-dom';

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

// Remove the export when the CommunityCarePreferencesPage.unit.spec.jsx is converted
export function CommunityCarePreferencesPage({
  schema,
  data,
  pageChangeInProgress,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
  openCommunityCarePreferencesPage,
}) {
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    openCommunityCarePreferencesPage(pageKey, uiSchema, initialSchema);
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="ccPreferences"
          title="Community Care preferences"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => routeToNextAppointmentPage(history, pageKey)}
          onChange={newData => updateFormData(pageKey, uiSchema, newData)}
          data={data}
        >
          <FormButtons
            onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...getFormPageInfo(state, pageKey),
  };
}

const mapDispatchToProps = {
  openCommunityCarePreferencesPage: actions.openCommunityCarePreferencesPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityCarePreferencesPage);
