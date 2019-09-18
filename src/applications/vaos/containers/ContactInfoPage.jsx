import React from 'react';
import { connect } from 'react-redux';
import { openFormPage, updateFormData } from '../actions/newAppointment.js';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

const initialSchema = {
  type: 'object',
  required: ['phoneNumber'],
  properties: {
    phoneNumber: {
      type: 'string',
      minLength: 10,
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

const pageKey = 'contact-info';

export class ContactInfoPage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.router.push('/new-appointment/reason-appointment');
  };

  goForward = () => {
    this.props.router.push('/');
  };

  render() {
    const { schema, data } = this.props;

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
        <div className="vads-l-row form-progress-buttons schemaform-buttons">
          <div className="vads-l-col--6 vads-u-padding-right--2p5">
            <ProgressButton
              onButtonClick={this.goBack}
              buttonText="Back"
              buttonClass="usa-button-secondary vads-u-width--full"
              beforeText="«"
            />
          </div>
          <div className="vads-l-col--6">
            <ProgressButton
              submitButton
              buttonText="Continue"
              buttonClass="usa-button-primary"
              afterText="»"
            />
          </div>
        </div>
      </SchemaForm>
    );
  }
}

function mapStateToProps(state) {
  return {
    schema: state.newAppointment.pages[pageKey],
    data: state.newAppointment.data,
  };
}

const mapDispatchToProps = {
  openFormPage,
  updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactInfoPage);
