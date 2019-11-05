import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import FormButtons from '../components/FormButtons';
import * as address from '../utils/address';
import { LANGUAGES } from './../utils/constants';

import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';

const initialSchema = {
  type: 'object',
  required: ['preferredLanguage', 'hasCommunityCareProvider', 'systemId'],
  properties: {
    systemId: {
      type: 'string',
      // enum: [],
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
  systemId: {
    'ui:title': 'What is the closest city and state for your appointment?',
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
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
      <>
        <h1 className="vads-u-font-size--h2">
          Share your community care provider preferences
        </h1>
        {!!schema && (
          <SchemaForm
            name="ccProvider"
            title="Community Care provider"
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
      </>
    );
  }
}

function mapStateToProps(state) {
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityCarePreferencesPage);
