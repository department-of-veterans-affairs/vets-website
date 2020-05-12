import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import FormButtons from '../components/FormButtons';
import * as address from '../utils/address';
import { LANGUAGES, FETCH_STATUS } from './../utils/constants';
import ErrorMessage from '../components/ErrorMessage';

import {
  openCommunityCarePreferencesPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';

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
          pattern: '^[0-9]{10}$',
        },
      },
    },
  },
};

const addressUISchema = address.uiSchema();
const uiSchema = {
  communityCareSystemId: {
    'ui:title': 'What’s the closest city and state to you?',
    'ui:widget': 'radio',
  },
  preferredLanguage: {
    'ui:title':
      'Do you prefer that your Community Care provider speak a certain language?',
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
const pageTitle = 'Tell us your Community Care preferences';

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
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const {
      schema,
      data,
      pageChangeInProgress,
      parentFacilitiesStatus,
    } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        {parentFacilitiesStatus === FETCH_STATUS.failed && <ErrorMessage />}
        {(!schema || parentFacilitiesStatus === FETCH_STATUS.loading) && (
          <LoadingIndicator message="Loading Community Care facilities" />
        )}
        {!!schema &&
          parentFacilitiesStatus === FETCH_STATUS.succeeded && (
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
