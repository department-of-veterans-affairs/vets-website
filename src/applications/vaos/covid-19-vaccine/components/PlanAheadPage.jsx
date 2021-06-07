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
import NewTabAnchor from '../../components/NewTabAnchor';
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
      <p>Here’s what you should know:</p>
      <ul>
        <li>Some COVID-19 vaccines require 2 doses</li>
        <li>
          If you get a vaccine that requires a second dose, we’ll schedule your
          second appointment while you’re here for your first dose.
        </li>
      </ul>

      <p>
        If you have questions,{' '}
        <NewTabAnchor
          href="/health-care/covid-19-vaccine"
          className="vads-u-margin-top--2"
          onClick={() => {
            recordEvent({
              event: `${GA_PREFIX}-COVID-19-vaccines-at-VA-link-clicked`,
            });
          }}
        >
          go to our main COVID-19 vaccine at VA page.
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
