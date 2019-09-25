import React from 'react';
import { connect } from 'react-redux';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import { getFormPageInfo } from '../utils/selectors';
import { PURPOSE_TEXT } from '../utils/constants';

const initialSchema = {
  type: 'object',
  required: ['reasonForAppointment'],
  properties: {
    reasonForAppointment: {
      type: 'string',
      enum: [
        PURPOSE_TEXT['routine-rollow-up'],
        PURPOSE_TEXT['new-issue'],
        PURPOSE_TEXT['medication-concern'],
      ],
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
        routine: <>Routine/Follow-up</>,
        newIssue: <>New Issue</>,
        medicationConcern: <>Medication Concern</>,
      },
    },
  },
};

const pageKey = 'reasonForAppointment';

export class ReasonForAppointmentPage extends React.Component {
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
      <div className="vaos-form__detailed-radio">
        <h1 className="vads-u-font-size--h2">
          Why do you want to make an
          <br /> appointment?
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
)(ReasonForAppointmentPage);
