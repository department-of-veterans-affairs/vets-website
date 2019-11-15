import React from 'react';
import { connect } from 'react-redux';
import {
  openFormPage,
  updateReasonForAppointmentData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import { getReasonForAppointment } from '../utils/selectors';
import { REASON_RADIO_BUTTONS } from '../utils/constants';

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
    'ui:title': 'Why are you making this appointment?',
    'ui:options': {
      labels: REASON_RADIO_BUTTONS,
    },
  },
  reasonAdditionalInfo: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
      expandUnder: 'reasonForAppointment',
      expandUnderCondition: reasonForAppointment => !!reasonForAppointment,
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
        <h1 className="vads-u-font-size--h2">Reason for appointment</h1>
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
          <AlertBox
            headline="If you are experiencing a medical emergency"
            className="vads-u-margin-top--3"
            content={
              <ul>
                <li>
                  Call <a href="tel:911">911</a>,{' '}
                  <span className="vads-u-font-weight--bold">or</span>
                </li>
                <li>
                  Call the Veterans Crisis hotline at{' '}
                  <a href="tel:800-273-8255">800-273-8255</a> and press 1,{' '}
                  <span className="vads-u-font-weight--bold">or</span>
                </li>
                <li>
                  Go to your nearest emergency room or VA medical center.{' '}
                  <a href="/find-locations">
                    Find your nearest VA medical center
                  </a>
                </li>
              </ul>
            }
            status="warning"
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
