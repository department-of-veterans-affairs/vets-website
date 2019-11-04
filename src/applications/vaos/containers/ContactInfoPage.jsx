import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import FormButtons from '../components/FormButtons';

import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';

const initialSchema = {
  type: 'object',
  required: ['phoneNumber', 'email'],
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^[0-9]{10}$',
    },
    bestTimeToCall: {
      type: 'object',
      properties: {
        morning: {
          type: 'boolean',
        },
        afternoon: {
          type: 'boolean',
        },
        evening: {
          type: 'boolean',
        },
      },
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

const uiSchema = {
  'ui:description': (
    <>
      <p>
        This is the contact information we have on file for you. We’ll use this
        information to contact you about scheduling your appointment. You can
        update your contact information here, but the updates will only apply to
        this tool.
      </p>
      <p className="vads-u-margin-y--2">
        If you want to update your contact information for all your VA accounts,
        please{' '}
        <a href="/profile" target="_blank" rel="noopener noreferrer">
          go to your profile page
        </a>
        .
      </p>
    </>
  ),
  phoneNumber: phoneUI('Phone number'),
  bestTimeToCall: {
    'ui:title': 'Best times for us to call you',
    morning: {
      'ui:title': 'Morning (8 a.m. – noon)',
      'ui:options': {
        widgetClassNames: 'vaos-form__checkbox',
      },
    },
    afternoon: {
      'ui:title': 'Afternoon (noon – 4 p.m.)',
      'ui:options': {
        widgetClassNames: 'vaos-form__checkbox',
      },
    },
    evening: {
      'ui:title': 'Evening (4 p.m. – 8 p.m.)',
      'ui:options': {
        widgetClassNames: 'vaos-form__checkbox',
      },
    },
  },
  email: {
    'ui:title': 'Email address',
  },
};

const pageKey = 'contactInfo';

export class ContactInfoPage extends React.Component {
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
      <div>
        <h1 className="vads-u-font-size--h2">Contact information</h1>

        <SchemaForm
          name="Contact info"
          title="Contact info"
          schema={schema || initialSchema}
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
      </div>
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
)(ContactInfoPage);
