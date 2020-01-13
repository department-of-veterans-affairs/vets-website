import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import moment from 'moment';

import {
  openFormPage,
  getAppointmentSlots,
  updateFormData,
  routeToNextAppointmentPage,
  startRequestAppointmentFlow,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { focusElement } from 'platform/utilities/ui';
import FormButtons from '../components/FormButtons';
import { getDateTimeSelect } from '../utils/selectors';
import DateTimeSelectField from '../components/DateTimeSelectField';
import WaitTimeAlert from '../components/WaitTimeAlert';
import { FETCH_STATUS } from '../utils/constants';

const pageKey = 'selectDateTime';
const pageTitle = 'Tell us the date and time you’d like your appointment';

const initialSchema = {
  type: 'object',
  required: ['calendarData'],
  properties: {
    calendarData: {
      type: 'object',
      properties: {
        currentlySelectedDate: {
          type: 'string',
        },
        currentRowIndex: {
          type: 'number',
        },
        selectedDates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
              },
              datetime: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

const uiSchema = {
  calendarData: {
    'ui:field': DateTimeSelectField,
    'ui:title': 'What date and time would you like to make an appointment?',
    'ui:options': {
      hideLabelText: true,
    },
  },
};

export class DateTimeSelectPage extends React.Component {
  componentDidMount() {
    focusElement('h1.vads-u-font-size--h2');
    const { preferredDate } = this.props;
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    this.props.getAppointmentSlots(
      moment(preferredDate)
        .startOf('month')
        .format('YYYY-MM-DD'),
      moment(preferredDate)
        .add(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD'),
    );
    document.title = `${pageTitle} | Veterans Affairs`;
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    if (this.props.data.calendarData?.selectedDates?.length) {
      this.props.routeToNextAppointmentPage(this.props.router, pageKey);
    }
  };

  render() {
    const {
      appointmentSlotsStatus,
      availableDates,
      availableSlots,
      data,
      eligibleForRequests,
      facilityId,
      pageChangeInProgress,
      preferredDate,
      schema,
      timezone,
      typeOfCareId,
    } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        {appointmentSlotsStatus !== FETCH_STATUS.loading && (
          <WaitTimeAlert
            eligibleForRequests={eligibleForRequests}
            facilityId={facilityId}
            nextAvailableApptDate={availableSlots?.[0]?.datetime}
            onClickRequest={this.props.startRequestAppointmentFlow}
            preferredDate={preferredDate}
            timezone={timezone}
            typeOfCareId={typeOfCareId}
          />
        )}
        {appointmentSlotsStatus !== FETCH_STATUS.failed && (
          <p>
            Please select a desired date and time for your appointment.
            {timezone && ` Appointment times are displayed in ${timezone}.`}
          </p>
        )}
        <SchemaForm
          name="Schedule appointment"
          title="Schedule appointment"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData => {
            this.props.updateFormData(pageKey, uiSchema, newData);
          }}
          formContext={{
            availableSlots,
            availableDates,
            preferredDate,
            getAppointmentSlots: this.props.getAppointmentSlots,
            loadingStatus: appointmentSlotsStatus,
          }}
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
  return getDateTimeSelect(state, pageKey);
}

const mapDispatchToProps = {
  getAppointmentSlots,
  openFormPage,
  updateFormData,
  startRequestAppointmentFlow,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeSelectPage);
