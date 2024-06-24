/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormLayout from '../new-appointment/components/FormLayout';
import CalendarWidget from '../components/calendar/CalendarWidget';
import { getSelectedLabel } from '../new-appointment/components/DateTimeRequestPage/SelectedIndicator';
// import DateTimeRequestOptions from '../new-appointment/components/DateTimeRequestPage/DateTimeRequestOptions';
// import {
//   selectDateTime,
//   selectFacility,
//   selectCCAppointment,
// } from './redux/selectors';

export default function ReviewApproved() {
  const submitted = false;
  const history = useHistory();

  const minDate = moment().add(5, 'd');
  if (minDate.day() === 6) minDate.add(2, 'days');
  if (minDate.day() === 0) minDate.add(1, 'days');

  // const dispatch = useDispatch();
  // const dateTime = useSelector(selectDateTime);
  // const facility = useSelector(selectFacility);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState('');
  // const [selectedDateTime, setSelectedDateTime] = useState(null);

  const availableSlots = [
    { start: '2024-06-12T09:00:00', end: '2024-06-12T10:00:00' },
    { start: '2024-06-14T10:00:00', end: '2024-06-14T11:00:00' },
  ];

  const selectedDates = ['2024-06-12', '2024-06-14'];

  // const handleFacilityChange = event => {
  //   setSelectedFacility(event.target.value);
  // };

  function userSelectedSlot(dates) {
    return dates?.length > 0;
  }

  const sortOptions = [
    [
      { value: 'distance', label: 'Distance' },
      { value: 'rating', label: 'Rating' },
      { value: 'availability', label: 'Availability' },
    ],
  ];

  //   <FormLayout>
  // <div>
  //   <CalendarWidget
  //     multiSelect
  //     maxSelections={maxSelections}
  //     maxSelectionsError="You can only choose up to 3 dates for your appointment"
  //     onChange={(...args) => dispatch(onCalendarChange(...args))}
  //     minDate={minDate.format('YYYY-MM-DD')}
  //     maxDate={moment()
  //       .add(120, 'days')
  //       .format('YYYY-MM-DD')}
  //     id="optionTime"
  //     renderSelectedLabel={getSelectedLabel}
  //     required
  //     requiredMessage="Select at least one preferred timeframe for your appointment."
  //     showValidation={submitted && !userSelectedSlot(selectedDates)}
  //   />
  // </div>
  // </FormLayout>

  return (
    <FormLayout pageTitle="CC Filter Page" isReviewPage>
      <div>
        <h1>Filter [physical therapy] providers -- </h1>
        <hr />
        <div>
          <VaSelect
            name="practice-type"
            data-test-id="practice-type"
            label="Practice"
            required
            value={[]}
            onVaSelect={e => setSelectedFacility(e.detail.value)}
          >
            {sortOptions[0].map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </VaSelect>
        </div>
        <div>
          <VaSelect
            name="location-type"
            data-test-id="location-type"
            label="Location"
            required
            value={[]}
            onVaSelect={e => setSelectedFacility(e.detail.value)}
          >
            {sortOptions[0].map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </VaSelect>
        </div>
        <div className="vads-u-margin-top--2">
          <va-button
            className="va-button-link"
            secondary
            text="Cancel"
            onClick={() => history.push('/choose-community-care-appointment')}
            data-testid="cancel-button"
            uswds
          />
          <va-button
            className="va-button-link"
            text="Apply"
            onClick={() => {
              // Dispatch actions to update the Redux store
              // Log the dateTime and facility values
              // console.log('DateTime:', selectedDate);
              // console.log('Facility:', selectedFacility);
              // Navigate to the route
              // history.push('/choose-community-care-appointment');
            }}
            data-testid="apply-button"
            uswds
          />
        </div>
      </div>
    </FormLayout>
  );
}
