import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import FormButtons from '../../components/FormButtons';
import { selectPageChangeInProgress } from '../redux/selectors';

const pageKey = 'planAhead';
const pageTitle = 'COVID-19 vaccine appointment';

export default function PlanAheadPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1>{pageTitle}</h1>
      <p>We can only schedule appointments for first vaccine doses online:</p>
      <ul>
        <li>
          If you get a vaccine that requires 2 doses, we’ll schedule your second
          appointment while you’re here for your first dose.
        </li>
        <li>
          If you’re eligible for a booster shot or additional dose, contact your
          VA health facility.
        </li>
      </ul>

      <p>
        Want to get your vaccine without an appointment?
        <br />
        Find out how to get your vaccine at a VA walk-in clinic
      </p>
      <FormButtons
        pageChangeInProgress={pageChangeInProgress}
        onBack={() =>
          dispatch(routeToPreviousAppointmentPage(history, pageKey))
        }
        onSubmit={() => {
          recordEvent({
            event: `${GA_PREFIX}-covid19-start-scheduling-button-clicked`,
          });
          recordEvent({
            event: `${GA_PREFIX}-covid19-path-started`,
          });
          dispatch(routeToNextAppointmentPage(history, pageKey));
        }}
      />
    </div>
  );
}
