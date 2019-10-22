import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  selectVet360EmailAddress,
  selectVet360HomePhoneString,
  selectVet360MobilePhoneString,
} from 'platform/user/selectors';
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
  required: ['phoneNumber'],
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
  },
};

const uiSchema = {
  'ui:title': 'Where can we call to confirm your appointment?',
  'ui:description':
    'A scheduling clerk will contact you to coordinate an appointment date',
  phoneNumber: phoneUI('Phone number'),
  bestTimeToCall: {
    'ui:title': 'Best times for VA to call',
    morning: {
      'ui:title': 'Morning (8 a.m. to noon EST)',
      'ui:options': {
        widgetClassNames: 'vaos-form__checkbox',
      },
    },
    afternoon: {
      'ui:title': 'Afternoon (noon - 4 p.m. EST)',
      'ui:options': {
        widgetClassNames: 'vaos-form__checkbox',
      },
    },
    evening: {
      'ui:title': 'Evening (4 p.m. to 8 p.m. EST)',
      'ui:options': {
        widgetClassNames: 'vaos-form__checkbox',
      },
    },
  },
};

const pageKey = 'contactInfo';

export class ContactInfoPage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    this.prefillForm();
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.homePhone && this.props.homePhone) ||
      (!prevProps.mobilePhone && this.props.mobilePhone) ||
      (!prevProps.emailAddress && this.props.emailAddress)
    ) {
      this.prefillForm();
    }
  }

  prefillForm = () => {
    const phoneNumber = this.props.mobilePhone || this.props.homePhone;
    // only prefill the phone number if it isn't already set
    if (phoneNumber && !this.props.data.phoneNumber) {
      this.props.updateFormData(pageKey, uiSchema, {
        ...this.props.data,
        phoneNumber,
      });
    }
    // The following is disabled since we don't yet have email address on this page.
    // When it's enabled it'll be best to refactor this to make a single call to
    // updateFormData.
    // // only prefill the email address if it isn't already set
    // if (this.props.emailAddress && !this.props.data.emailAddress) {
    //   this.props.updateFormData(pageKey, uiSchema, {
    //     ...this.props.data,
    //     emailAddress: this.props.emailAddress,
    //   });
    // }
  };

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
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
    );
  }
}

function mapStateToProps(state) {
  const formPageInfo = getFormPageInfo(state, pageKey);
  return {
    ...formPageInfo,
    emailAddress: selectVet360EmailAddress(state),
    homePhone: selectVet360HomePhoneString(state),
    mobilePhone: selectVet360MobilePhoneString(state),
  };
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
