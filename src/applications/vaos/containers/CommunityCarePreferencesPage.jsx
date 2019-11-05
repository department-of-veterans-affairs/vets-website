import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import FormButtons from '../components/FormButtons';
import * as address from '../utils/address';
import { LANGUAGES } from './../utils/constants';

import {
  openCommunityCarePreferencesPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';

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
        address: address.schema,
        phone: {
          type: 'string',
          minLength: 10,
        },
      },
    },
  },
};

const addressUISchema = address.uiSchema();
const uiSchema = {
  communityCareSystemId: {
    'ui:title': 'What is the closest city and state for your appointment?',
    'ui:widget': 'radio',
  },
  preferredLanguage: {
    'ui:title':
      'Do you have a preferred language for your Community Care provider?',
  },
  hasCommunityCareProvider: {
    'ui:widget': 'yesNo',
    'ui:title':
      'Do you have a referral or preferred Community Care provider for this appointment?',
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
        'ui:required': data => data.hasCommunityCareProvider,
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
  },
};

const pageKey = 'ccPreferences';

export class CommunityCarePreferencesPage extends React.Component {
  componentDidMount() {
    this.props.openCommunityCarePreferencesPage(
      pageKey,
      uiSchema,
      initialSchema,
    );
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress, loading } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">
          Share your community care provider preferences
        </h1>
        {(!schema || loading) && (
          <LoadingIndicator message="Loading Community Care facilities" />
        )}
        {!!schema &&
          !loading && (
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
    loading: state.newAppointment.loadingSystems,
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
