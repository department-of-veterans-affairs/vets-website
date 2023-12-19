import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../flow';
import { GA_PREFIX } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import FormButtons from '../../components/FormButtons';
import { selectPageChangeInProgress } from '../redux/selectors';
import NewTabAnchor from '../../components/NewTabAnchor';

const pageKey = 'planAhead';
const pageTitle = 'COVID-19 vaccine appointment';

export default function PlanAheadPage({ changeCrumb }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    changeCrumb(pageTitle);
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
        <NewTabAnchor
          href="/health-care/covid-19-vaccine"
          className="vads-u-margin-top--2"
          onClick={() => {
            recordEvent({
              event: `${GA_PREFIX}-COVID-19-vaccines-at-VA-link-clicked`,
            });
          }}
        >
          Find out how to get your vaccine at a VA walk-in clinic
        </NewTabAnchor>
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

PlanAheadPage.propTypes = {
  changeCrumb: PropTypes.func,
};
