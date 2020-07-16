import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import FormButtons from '../components/FormButtons';

import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';

const initialSchema = {
  type: 'object',
  required: ['phoneNumber', 'email', 'bestTimeToCall'],
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
  phoneNumber: phoneUI('Your phone number'),
  bestTimeToCall: {
    'ui:title': 'What are the best times for us to call you?',
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
      classNames: 'vaos-form__checkboxgroup',
    },
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
    'ui:title': 'Your email address',
  },
};

const pageKey = 'contactInfo';
const pageTitle = 'Your contact information';

export class ContactInfoPage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
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
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>

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
            loadingText="Page change in progress"
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
