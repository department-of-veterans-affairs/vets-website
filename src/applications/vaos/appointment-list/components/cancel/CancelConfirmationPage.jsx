import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useHistory,
  useParams,
} from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import { GA_PREFIX } from '../../../utils/constants';
import { startNewAppointmentFlow } from '../../redux/actions';
import PageLayout from '../PageLayout';
import BackLink from '../../../components/BackLink';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../../../new-appointment/newAppointmentFlow';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { selectRequestedAppointmentDetails } from '../../redux/selectors';
import CancelPageLayout from './CancelPageLayout';

function handleClick(history, dispatch, url) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(url);
  };
}

export default function CancelConfirmationPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const { cancelInfo, appointment } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );
  const { typeOfCare: page } = useSelector(getNewAppointmentFlow);

  const { showCancelModal } = cancelInfo;

  useEffect(() => {
    scrollAndFocus();
  }, []);

  if (!showCancelModal) {
    return null;
  }

  return (
    <PageLayout showNeedHelp>
      <BackLink appointment={appointment} featureAppointmentDetailsRedesign />
      <h1 className="vads-u-margin-y--2p5">
        You have canceled your appointment
      </h1>
      <p>
        If you still need an appointment, call us or request a new appointment
        online.
      </p>
      <a
        className="vads-c-action-link--blue vaos-hide-for-print vads-u-margin-bottom--2p5"
        href="/"
        onClick={handleClick(history, dispatch, page.url)}
      >
        Scheduling a new appointment
      </a>
      <CancelPageLayout />
    </PageLayout>
  );
}
