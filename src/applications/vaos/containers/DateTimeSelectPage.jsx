import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import {
  openSelectAppointmentPage,
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

const pageKey = 'selectDateTime';

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
    this.props.openSelectAppointmentPage(pageKey, uiSchema, initialSchema);
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
      schema,
      data,
      pageChangeInProgress,
      availableSlots,
      availableDates,
      loadingAppointmentSlots,
      timezone,
      typeOfCareId,
      preferredDate,
      eligibleForRequests,
    } = this.props;

    const title = (
      <h1 className="vads-u-font-size--h2">
        What date and time would you like to make an appointment?
      </h1>
    );

    if (loadingAppointmentSlots) {
      return (
        <div>
          {title}
          <LoadingIndicator message="Finding appointment availability..." />
        </div>
      );
    }

    return (
      <div>
        {title}
        <WaitTimeAlert
          preferredDate={preferredDate}
          nextAvailableApptDate={availableDates?.[0]}
          typeOfCareId={typeOfCareId}
          eligibleForRequests={eligibleForRequests}
          onClickRequest={this.props.startRequestAppointmentFlow}
        />
        <p>
          Please select a desired date and time for your appointment.
          {timezone && ` Appointment times are displayed in ${timezone}.`}
        </p>
        <SchemaForm
          name="Schedule appointment"
          title="Schedule appointment"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData => {
            this.props.updateFormData(pageKey, uiSchema, newData);
          }}
          formContext={{ availableSlots, availableDates }}
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
  openSelectAppointmentPage,
  updateFormData,
  startRequestAppointmentFlow,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeSelectPage);
