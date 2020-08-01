import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import FormButtons from '../components/FormButtons';
import CalendarWidget from '../components/calendar/CalendarWidget';
import { getFormPageInfo } from '../utils/selectors';
import { CALENDAR_INDICATOR_TYPES } from '../utils/constants';

const pageKey = 'requestDateTime';
const pageTitle = 'Choose a day and time for your appointment';

const maxSelections = 3;

const missingDateError =
  'Please select at least one preferred date for your appointment. You can select up to three dates.';
const maxSelectionsError =
  'You can only choose up to 3 dates for your appointment.';

export function getOptionsByDate() {
  return [
    {
      value: 'AM',
      label: 'AM',
    },
    {
      value: 'PM',
      label: 'PM',
    },
  ];
}
export class DateTimeRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { submitted: false, validationError: null };
  }

  componentDidMount() {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }

  componentDidUpdate(prevProps, prevState) {
    const { validationError } = this.state;
    if (
      validationError &&
      (this.isMaxSelectionsError() ||
        (!prevState.submitted && this.state.submitted))
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
    if (
      this.userSelectedSlot(calendarData) &&
      !this.exceededMaxSelections(calendarData)
    ) {
      this.props.routeToNextAppointmentPage(router, pageKey);
    } else if (this.state.submitted) {
      scrollAndFocus('.usa-input-error-message');
    } else {
      this.setState({ submitted: true });
    }
  };

  validate = data => {
    if (this.exceededMaxSelections(data)) {
      this.setState({ validationError: maxSelectionsError });
    } else if (!this.userSelectedSlot(data)) {
      this.setState({
        validationError: missingDateError,
      });
    } else {
      this.setState({ validationError: null });
    }
  };

  userSelectedSlot = calendarData => calendarData?.selectedDates?.length > 0;

  exceededMaxSelections = calendarData =>
    calendarData?.selectedDates?.length > maxSelections;

  isMaxSelectionsError = () =>
    this.state.validationError === maxSelectionsError;

  render() {
    const { data, pageChangeInProgress } = this.props;
    const calendarData = data?.calendarData || {};
    const { currentlySelectedDate, selectedDates } = calendarData;
    const { validationError } = this.state;

    const additionalOptions = {
      fieldName: 'optionTime',
      required: true,
      maxSelections: 2,
      validationMessage:
        'Please select a preferred time or unselect this date to continue',
      getOptionsByDate,
    };

    return (
      <div className="vaos-form__detailed-radio">
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        <p>
          You can choose up to 3 dates. A scheduling coordinator will call you
          to schedule the best time for your appointment.
        </p>
        <CalendarWidget
          monthsToShowAtOnce={2}
          multiSelect
          maxSelections={maxSelections}
          onChange={newData => {
            this.validate(newData);
            this.props.onCalendarChange(newData);
          }}
          minDate={moment()
            .add(5, 'days')
            .format('YYYY-MM-DD')}
          maxDate={moment()
            .add(120, 'days')
            .format('YYYY-MM-DD')}
          currentlySelectedDate={currentlySelectedDate}
          selectedDates={selectedDates}
          selectedIndicatorType={CALENDAR_INDICATOR_TYPES.BUBBLES}
          additionalOptions={additionalOptions}
          validationError={
            this.state.submitted || this.isMaxSelectionsError()
              ? validationError
              : null
          }
        />
        <FormButtons
          onBack={this.goBack}
          onSubmit={this.goForward}
          pageChangeInProgress={pageChangeInProgress}
          loadingText="Page change in progress"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeRequestPage);
