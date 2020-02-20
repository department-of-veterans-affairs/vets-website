import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  clearCalendarData,
  onCalendarChange,
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
  validateCalendar,
} from '../actions/newAppointment.js';
import { focusElement } from 'platform/utilities/ui';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import FormButtons from '../components/FormButtons';
import CalendarWidget from '../components/calendar/CalendarWidget';
import { getFormPageInfo } from '../utils/selectors';
import { CALENDAR_INDICATOR_TYPES } from '../utils/constants';

const pageKey = 'requestDateTime';
const pageTitle = 'Choose a day and time for your appointment';

export class DateTimeRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { validationError: null };
  }

  componentDidMount() {
    focusElement('h1.vads-u-font-size--h2');
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

  getOptionsByDate = () => [
    {
      value: 'AM',
      label: 'AM',
    },
    {
      value: 'PM',
      label: 'PM',
    },
  ];

  goBack = () => {
    this.props.clearCalendarData();
    if (!this.state.validationError) {
      this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
    }
  };

  goForward = () => {
    this.props.validateCalendar(pageKey);
    if (this.props.data.calendarData?.selectedDates?.length > 0) {
      this.props.routeToNextAppointmentPage(this.props.router, pageKey);
    } else {
      scrollAndFocus('.usa-input-error-message');
    }
  };

  validate = () => {
    if (this.userSelectedSlot()) {
      this.setState({ validationError: null });
    } else {
      this.setState({
        validationError:
          'Please select at least one preferred date for your appointment. You can select up to three dates.',
      });
    }
  };

  render() {
    const { data, pageChangeInProgress } = this.props;
    const calendarData = data?.calendarData;
    const { currentlySelectedDate, selectedDates, error } = calendarData;

    const additionalOptions = {
      fieldName: 'optionTime',
      required: true,
      maxSelections: 2,
      validationMessage:
        'Please select a preferred time or unselect this date to continue',
      getOptionsByDate: this.getOptionsByDate,
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
          maxSelections={3}
          onChange={this.props.onCalendarChange}
          minDate={moment()
            .add(5, 'days')
            .format('YYYY-MM-DD')}
          maxDate={moment()
            .add(395, 'days')
            .format('YYYY-MM-DD')}
          currentlySelectedDate={currentlySelectedDate}
          selectedDates={selectedDates}
          selectedIndicatorType={CALENDAR_INDICATOR_TYPES.BUBBLES}
          additionalOptions={additionalOptions}
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
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  clearCalendarData,
  onCalendarChange,
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
  validateCalendar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeRequestPage);
