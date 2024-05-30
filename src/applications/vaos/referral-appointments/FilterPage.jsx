import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import FormLayout from '../new-appointment/components/FormLayout';
import CalendarWidget from '../components/calendar/CalendarWidget';
import SelectedIndicator, {
  getSelectedLabel,
} from '../new-appointment/components/DateTimeRequestPage/SelectedIndicator';
import { onCalendarChange } from '../new-appointment/redux/actions';
import DateTimeRequestOptions from '../new-appointment/components/DateTimeRequestPage/DateTimeRequestOptions';

export default function ReviewApproved() {
  const maxSelections = 0;

  const submitted = false;

  const selectedDates = [];

  const minDate = moment().add(5, 'd');
  if (minDate.day() === 6) minDate.add(2, 'days');
  if (minDate.day() === 0) minDate.add(1, 'days');

  const dispatch = useDispatch();

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
    <FormLayout isReviewPage="true">
      <div>
        <h1>Filter [physical therapy] providers</h1>
        <hr />
        <div>Date:</div>
        <div>
          <CalendarWidget
            multiSelect
            maxSelections={maxSelections}
            maxSelectionsError="You can only choose up to 3 dates for your appointment"
            onChange={(...args) => dispatch(onCalendarChange(...args))}
            minDate={minDate.format('YYYY-MM-DD')}
            maxDate={moment()
              .add(120, 'days')
              .format('YYYY-MM-DD')}
            value={selectedDates}
            id="optionTime"
            renderIndicator={props => <SelectedIndicator {...props} />}
            renderOptions={props => <DateTimeRequestOptions {...props} />}
            renderSelectedLabel={getSelectedLabel}
            required
            requiredMessage="Select at least one preferred timeframe for your appointment."
            showValidation={submitted && !userSelectedSlot(selectedDates)}
          />
        </div>
        <div>
          <va-select
            hint={null}
            label="Facility:"
            message-aria-describedby="Sort provider by"
            name="options"
            value=""
          >
            {sortOptions[0].map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </va-select>
        </div>
        <div className="vads-u-margin-top--2">
          <va-button
            className="va-button-link"
            secondary
            text="Canel"
            data-testid="cancel-button"
            uswds
          />
          <va-button
            className="va-button-link"
            text="Apply"
            data-testid="apply-button"
            uswds
          />
        </div>
      </div>
    </FormLayout>
  );
}
