import React from 'react';
import { connect } from 'react-redux';
import { openFormPage, updateFormData } from '../actions/newAppointment.js';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

const initialSchema = {
  type: 'object',
  required: ['reasonForAppointment'],
  properties: {
    reasonForAppointment: {
      type: 'string',
      enum: ['routine', 'newIssue', 'medicationConcern'],
    },
  },
};

const uiSchema = {
  reasonForAppointment: {
    'ui:title': 'Why do you want to make an appointment?',
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {
        routine: (
          <>
            <span className="vads-u-display--block vads-u-font-size--sm ">
              Routine/Follow-up
            </span>
          </>
        ),
        newIssue: (
          <>
            <span className="vads-u-display--block vads-u-font-size--sm ">
              New Issue
            </span>
          </>
        ),
        medicationConcern: (
          <>
            <span className="vads-u-display--block vads-u-font-size--sm ">
              Medication Concern
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'reason-appointment';

export class ReasonForAppointmentPage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.router.push('/new-appointment');
  };

  goForward = () => {
    this.props.router.push('/new-appointment/contact-info');
  };

  render() {
    const { schema, data } = this.props;

    return (
      <div className="vaos-form__detailed-radio">
        <h1 className="vads-u-font-size--h2">
          Why do you want to make an appointment?
        </h1>
        <SchemaForm
          name="Reason for appointment"
          title="Reason for appointment"
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
      </div>
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
)(ReasonForAppointmentPage);
