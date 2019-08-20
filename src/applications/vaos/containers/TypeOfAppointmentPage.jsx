import React from 'react';
import { connect } from 'react-redux';
import { openFormPage, updateFormData } from '../actions/newAppointment.js';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

const initialSchema = {
  type: 'object',
  required: ['typeOfAppointment'],
  properties: {
    typeOfAppointment: {
      type: 'string',
      enum: ['provider', 'typeOfCare'],
    },
  },
};

const uiSchema = {
  typeOfAppointment: {
    'ui:title': 'How would you like to make an appointment?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        provider: 'Provider',
        typeOfCare: 'Type of care',
      },
    },
  },
};

const pageKey = 'type-appointment';

export class TypeOfAppointmentPage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.router.push('/');
  };

  goForward = () => {
    this.props.router.push('/');
  };

  render() {
    const { schema, data } = this.props;

    return (
      <SchemaForm
        name="Type of appointment"
        title="Type of appointment"
        schema={schema}
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
    schema: state.newAppointment.pages[pageKey] || initialSchema,
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
)(TypeOfAppointmentPage);
