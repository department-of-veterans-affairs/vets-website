import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import {
  getAppointmentSlots,
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  startRequestAppointmentFlow,
  requestAppointmentDateChoice,
} from '../actions/newAppointment.js';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import FormButtons from '../components/FormButtons';
import { getDateTimeSelect } from '../utils/selectors';
import CalendarWidget from '../components/calendar/CalendarWidget';
import WaitTimeAlert from '../components/WaitTimeAlert';
import { FETCH_STATUS } from '../utils/constants';
import { getRealFacilityId } from '../utils/appointment';

const pageKey = 'selectDateTime';
const pageTitle = 'Tell us the date and time you’d like your appointment';

const missingDateError = 'Please select a preferred date for your appointment';

export function getOptionsByDate(selectedDate, availableSlots = []) {
  return availableSlots.reduce((acc, slot) => {
    if (slot.start.split('T')[0] === selectedDate) {
      const time = moment(slot.start);
      const meridiem = time.format('A');
      const screenReaderMeridiem = meridiem.replace(/\./g, '').toUpperCase();
      acc.push({
        value: slot.start,
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
}

function ErrorMessage({ facilityId, startRequestFlow }) {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="error"
        headline="We’ve run into a problem when trying to find available appointment times"
      >
        To schedule this appointment, you can{' '}
        <button onClick={startRequestFlow} className="va-button-link">
          submit a request for a VA appointment
        </button>{' '}
        or{' '}
        <a
          href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          call your local VA medical center
        </a>
        .
      </AlertBox>
    </div>
  );
}

export class DateTimeSelectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      validationError: null,
    };
  }

  componentDidMount() {
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
    scrollAndFocus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.validationError &&
      !prevState.submitted &&
      this.state.submitted
    ) {
      scrollAndFocus('.usa-input-error-message');
    }
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    const { data, router } = this.props;
    const { calendarData } = data || {};
    this.validate(calendarData);
    if (this.userSelectedSlot(calendarData)) {
      this.props.routeToNextAppointmentPage(router, pageKey);
    } else if (this.state.submitted) {
      scrollAndFocus('.usa-input-error-message');
    } else {
      this.setState({ submitted: true });
    }
  };

  startRequestFlow = () => {
    this.props.requestAppointmentDateChoice(this.props.router);
  };

  validate = data => {
    if (this.userSelectedSlot(data)) {
      this.setState({ validationError: null });
    } else {
      this.setState({
        validationError: missingDateError,
      });
    }
  };

  userSelectedSlot(calendarData) {
    return calendarData?.selectedDates?.length > 0;
  }

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

    const calendarData = data?.calendarData || {};
    const { currentlySelectedDate, selectedDates } = calendarData;
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
            nextAvailableApptDate={availableSlots?.[0]?.start}
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
            getOptionsByDate: selectedDate =>
              getOptionsByDate(selectedDate, availableSlots),
          }}
          loadingStatus={appointmentSlotsStatus}
          loadingErrorMessage={
            <ErrorMessage
              facilityId={facilityId}
              startRequestFlow={this.startRequestFlow}
            />
          }
          onChange={newData => {
            this.validate(newData);
            this.props.onCalendarChange(newData);
          }}
          onClickNext={this.props.getAppointmentSlots}
          onClickPrev={this.props.getAppointmentSlots}
          minDate={moment()
            .add(1, 'days')
            .format('YYYY-MM-DD')}
          maxDate={moment()
            .add(395, 'days')
            .format('YYYY-MM-DD')}
          startMonth={startMonth}
          validationError={
            this.state.submitted ? this.state.validationError : null
          }
        />
        <FormButtons
          onBack={this.goBack}
          onSubmit={this.goForward}
          disabled={appointmentSlotsStatus === FETCH_STATUS.failed}
          pageChangeInProgress={pageChangeInProgress}
          loadingText="Page change in progress"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return getDateTimeSelect(state, pageKey);
}

const mapDispatchToProps = {
  getAppointmentSlots,
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  startRequestAppointmentFlow,
  requestAppointmentDateChoice,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeSelectPage);
