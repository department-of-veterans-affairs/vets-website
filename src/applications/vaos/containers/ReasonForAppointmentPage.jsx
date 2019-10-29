import React from 'react';
import { connect } from 'react-redux';
import {
  openFormPage,
  updateReasonForAppointmentData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import { getReasonForAppointment } from '../utils/selectors';
import { PURPOSE_TEXT } from '../utils/constants';

const initialSchema = {
  type: 'object',
  required: ['reasonForAppointment', 'reasonAdditionalInfo'],
  properties: {
    reasonForAppointment: {
      type: 'string',
      enum: ['routine-follow-up', 'new-issue', 'medication-concern', 'other'],
    },
    reasonAdditionalInfo: {
      type: 'string',
    },
  },
};

const uiSchema = {
  reasonForAppointment: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: PURPOSE_TEXT,
    },
  },
  reasonAdditionalInfo: {
    'ui:title': 'Provide additional details for your appointment.',
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
      hideIf: formData => !formData.reasonForAppointment,
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
    const {
      schema,
      data,
      pageChangeInProgress,
      reasonRemainingChar,
    } = this.props;

    return (
      <div>
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
            this.props.updateReasonForAppointmentData(
              pageKey,
              uiSchema,
              newData,
            )
          }
          data={data}
        >
          {data.reasonForAppointment && (
            <div className="vads-u-font-style--italic vads-u-margin-top--neg3 vads-u-margin-bottom--2p5">
              {reasonRemainingChar} characters remaining
            </div>
          )}
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
  return getReasonForAppointment(state, pageKey);
}

const mapDispatchToProps = {
  openFormPage,
  updateReasonForAppointmentData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReasonForAppointmentPage);
