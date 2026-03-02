import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GA_PREFIX } from '../../utils/constants';
import { getPageTitle } from '../newAppointmentFlow';
import {
  routeToNextAppointmentPage,
  startNewAppointmentFlow,
} from '../redux/actions';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

const pageKey = 'urgentCareInformation';
function handleClick(history, dispatch) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    recordEvent({
      event: `${GA_PREFIX}-start-scheduling-link`,
    });
    dispatch(startNewAppointmentFlow());
    dispatch(routeToNextAppointmentPage(history, pageKey));
  };
}

export default function UrgentCareInformationPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
    },
    [pageTitle],
  );

  useEffect(() => {
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1 className="vaos__dynamic-font-size--h2">{pageTitle}</h1>
      <p>
        You can schedule or request non-urgent appointments for future dates.
      </p>
      <a
        className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-bottom--3"
        href="/"
        onClick={handleClick(history, dispatch)}
      >
        Start scheduling an appointment
      </a>
      <h2 className="vads-u-font-size--h3 vads-u-margin--0">
        If you need help sooner, use one of these urgent communications options:
      </h2>
      <ul>
        <li>
          <strong>If you're in crisis or having thoughts of suicide</strong>,
          connect with our Veterans Crisis Line. We offer confidential support
          anytime, day or night.
        </li>
      </ul>
      <va-button
        class="vads-u-margin-left--3"
        text="Connect with the Veterans Crisis Line"
        secondary
        uswds
        onClick={() => {
          const element = document.getElementById('modal-crisisline');
          element?.classList.add('va-overlay--open');
        }}
      />
      <ul>
        <li>
          <strong>If you think your life or health is in danger</strong>, call{' '}
          <va-telephone contact="911" /> or go to the nearest emergency room.
        </li>
        <li>
          <strong>If you have a minor illness or injury</strong>, you may be
          able to get care faster at an{' '}
          <a href="https://www.va.gov/find-locations/?facilityType=urgent_care">
            urgent care facility
          </a>
          .
        </li>
      </ul>
      <a href="https://www.va.gov/resources/choosing-between-urgent-and-emergency-care/">
        Learn how to choose between urgent and emergency care
      </a>
    </div>
  );
}
