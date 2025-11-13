import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { formatInTimeZone } from 'date-fns-tz';
import { addDays, parseISO } from 'date-fns';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getReviewPage, selectPageChangeInProgress } from '../redux/selectors';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../flow';
import { getTimezoneByFacilityId } from '../../utils/timezone';
import { DATE_FORMATS } from '../../utils/constants';
import { selectFeatureUseBrowserTimezone } from '../../redux/selectors';

const pageKey = 'secondDosePage';
const pageTitle = 'When to plan for a second dose';

export default function SecondDosePage() {
  const { data } = useSelector(
    state => getReviewPage(state, pageKey),
    shallowEqual,
  );
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const featureUseBrowserTimezone = useSelector(
    selectFeatureUseBrowserTimezone,
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const { date1, vaFacility } = data;
  const selectedDate = parseISO(date1[0]);
  const timezone = getTimezoneByFacilityId(
    vaFacility,
    featureUseBrowserTimezone,
  );

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1>{pageTitle}</h1>
      <div className="vads-u-margin-bottom--4">
        <p>
          If you get your first dose of a 2-dose vaccine on{' '}
          <strong>
            {formatInTimeZone(
              selectedDate,
              timezone,
              DATE_FORMATS.friendlyWeekdayDate,
            )}
          </strong>
          , here’s when to plan to come back for your second dose.
        </p>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
          Moderna
        </h2>
        <div>
          Requires 2 doses
          <br />
          Plan to return{' '}
          <strong>
            after{' '}
            {formatInTimeZone(
              addDays(selectedDate, 28),
              timezone,
              DATE_FORMATS.friendlyWeekdayDate,
            )}
          </strong>
        </div>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">Pfizer</h2>
        <div>
          Requires 2 doses
          <br />
          Plan to return{' '}
          <strong>
            after{' '}
            {formatInTimeZone(
              addDays(selectedDate, 21),
              timezone,
              DATE_FORMATS.friendlyWeekdayDate,
            )}
          </strong>
        </div>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
          Johnson & Johnson
        </h2>
        <div>1 dose only</div>
      </div>
      <FormButtons
        pageChangeInProgress={pageChangeInProgress}
        onBack={() =>
          dispatch(routeToPreviousAppointmentPage(history, pageKey))
        }
        onSubmit={() => dispatch(routeToNextAppointmentPage(history, pageKey))}
      />
    </div>
  );
}
