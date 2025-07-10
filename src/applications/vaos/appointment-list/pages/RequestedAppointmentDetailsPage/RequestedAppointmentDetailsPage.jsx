import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BackLink from '../../../components/BackLink';
import AppointmentDetailsErrorMessage from '../../components/AppointmentDetailsErrorMessage';
import FacilityAddress from '../../../components/FacilityAddress';
import FacilityPhone from '../../../components/FacilityPhone';
import FullWidthLayout from '../../../components/FullWidthLayout';
import CCRequestLayout from '../../../components/layouts/CCRequestLayout';
import VARequestLayout from '../../../components/layouts/VARequestLayout';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import PageLayout from '../../components/PageLayout';
import {
  closeCancelAppointment,
  fetchRequestDetails,
} from '../../redux/actions';
import { selectRequestedAppointmentDetails } from '../../redux/selectors';
import CancelConfirmationPage from '../CancelAppointmentPage/CancelConfirmationPage';
import CancelWarningPage from '../CancelAppointmentPage/CancelWarningPage';

export default function RequestedAppointmentDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(fetchRequestDetails(id));
      return () => {
        dispatch(closeCancelAppointment());
      };
    },
    [dispatch, id],
  );

  const {
    appointment,
    appointmentDetailsStatus,
    cancelInfo,
    facility,
    facilityPhone,
    isCC,
    isCanceled,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );

  useEffect(
    () => {
      if (appointment) {
        let title = `${
          isCanceled ? 'Canceled Request For ' : 'Pending Request For '
        }${isCC ? 'Community Care Appointment' : 'Appointment'}`;
        title = title.concat(` | Veterans Affairs`);

        document.title = title;
      }
      scrollAndFocus();
    },
    [dispatch, isCanceled, isCC, appointment],
  );

  useEffect(
    () => {
      if (
        appointmentDetailsStatus === FETCH_STATUS.failed ||
        (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
      ) {
        scrollAndFocus();
      }
    },

    [appointmentDetailsStatus, appointment],
  );

  if (
    appointmentDetailsStatus === FETCH_STATUS.failed ||
    (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
  ) {
    return (
      <FullWidthLayout>
        <AppointmentDetailsErrorMessage />
      </FullWidthLayout>
    );
  }
  if (!appointment || appointmentDetailsStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator
          set-focus
          message="Loading your appointment request..."
        />
      </FullWidthLayout>
    );
  }

  if (isCC && cancelInfo.showCancelModal === false) {
    return <CCRequestLayout data={appointment} />;
  }
  if (isCC === false && cancelInfo.showCancelModal === false) {
    return <VARequestLayout data={appointment} />;
  }

  if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator
          set-focus
          message="Canceling your appointment..."
        />
      </FullWidthLayout>
    );
  }
  if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.notStarted) {
    return (
      <PageLayout showNeedHelp>
        <CancelWarningPage
          {...{
            appointment,
            cancelInfo,
          }}
        />
      </PageLayout>
    );
  }
  if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded) {
    return (
      <PageLayout showNeedHelp>
        <CancelConfirmationPage {...{ appointment, cancelInfo }} />
      </PageLayout>
    );
  }
  if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.failed) {
    return (
      <PageLayout showNeedHelp>
        <BackLink appointment={appointment} />
        <div className="vads-u-margin-y--2p5">
          <VaAlert status="error" visible>
            <h2 slot="headline">We couldn’t cancel your request</h2>
            <p>
              Something went wrong when we tried to cancel this request. Please
              contact your medical center to cancel:
              <br />
              <br />
              {isCC && (
                <>
                  <strong>{facility?.name}</strong>
                  <br />
                  <FacilityAddress
                    facility={facility}
                    showPhone
                    phoneHeading="Facility phone:"
                  />
                </>
              )}
              {!!facility &&
                !isCC && (
                  <>
                    <VAFacilityLocation
                      facility={facility}
                      facilityName={facility?.name}
                      facilityId={facility?.id}
                      showDirectionsLink={false}
                      showPhone={false}
                    />
                    <br />
                    <FacilityPhone contact={facilityPhone} level={3} />
                  </>
                )}
            </p>
          </VaAlert>
        </div>
      </PageLayout>
    );
  }
}
