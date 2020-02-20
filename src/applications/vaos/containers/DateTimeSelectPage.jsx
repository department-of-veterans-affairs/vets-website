import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  clearCalendarData,
  getAppointmentSlots,
  onCalendarChange,
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  startRequestAppointmentFlow,
  updateFormData,
  validateCalendar,
} from '../actions/newAppointment.js';
import { focusElement } from 'platform/utilities/ui';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import FormButtons from '../components/FormButtons';
import { getDateTimeSelect } from '../utils/selectors';
import CalendarWidget from '../components/calendar/CalendarWidget';
import WaitTimeAlert from '../components/WaitTimeAlert';
import { FETCH_STATUS } from '../utils/constants';

const pageKey = 'selectDateTime';
const pageTitle = 'Tell us the date and time you’d like your appointment';

export class DateTimeSelectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { validationError: null };
  }

  componentDidMount() {
    focusElement('h1.vads-u-font-size--h2');
    const { preferredDate } = this.props;
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

  componentDidUpdate(prevProps) {
    if (
      !prevProps.data?.calendarData?.error &&
      this.props.data?.calendarData?.error?.length > 0
    ) {
      scrollAndFocus('.usa-input-error-message');
    }
  }

  getOptionsByDate = selectedDate => {
    const availableSlots = this.props.availableSlots || [];
    const options = availableSlots.reduce((acc, slot) => {
      if (slot.date === selectedDate) {
        const time = moment(slot.datetime);
        const meridiem = time.format('A');
        const screenReaderMeridiem = meridiem.replace(/\./g, '').toUpperCase();
        acc.push({
          value: slot.datetime,
          label: (
            <>
              {time.format('h:mm')} <span aria-hidden="true">{meridiem}</span>{' '}
              <span className="sr-only">{screenReaderMeridiem}</span>
            </>
          ),
        });
      }
      return acc;
    }, []);

    return options;
  };

  goBack = () => {
    this.props.clearCalendarData();
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.validateCalendar(pageKey);
    if (this.props.data.calendarData?.selectedDates?.length > 0) {
      this.props.routeToNextAppointmentPage(this.props.router, pageKey);
    } else {
      scrollAndFocus('.usa-input-error-message');
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
      timezone,
      typeOfCareId,
    } = this.props;

    const calendarData = data?.calendarData;
    const { currentlySelectedDate, selectedDates, error } = calendarData;
    const startMonth = preferredDate
      ? moment(preferredDate).format('YYYY-MM')
      : null;

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
        <CalendarWidget
          monthsToShowAtOnce={2}
          maxSelections={1}
          availableDates={availableDates}
          currentlySelectedDate={currentlySelectedDate}
          selectedDates={selectedDates}
          additionalOptions={{
            fieldName: 'datetime',
            required: true,
            maxSelections: 1,
            getOptionsByDate: this.getOptionsByDate,
          }}
          loadingStatus={appointmentSlotsStatus}
          onChange={this.props.onCalendarChange}
          onClickNext={getAppointmentSlots}
          onClickPrev={getAppointmentSlots}
          minDate={moment()
            .add(1, 'days')
            .format('YYYY-MM-DD')}
          maxDate={moment()
            .add(395, 'days')
            .format('YYYY-MM-DD')}
          startMonth={startMonth}
          validationError={error}
        />
        <FormButtons
          onBack={this.goBack}
          onSubmit={this.goForward}
          pageChangeInProgress={pageChangeInProgress}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return getDateTimeSelect(state, pageKey);
}

const mapDispatchToProps = {
  clearCalendarData,
  getAppointmentSlots,
  onCalendarChange,
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  startRequestAppointmentFlow,
  updateFormData,
  validateCalendar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeSelectPage);
