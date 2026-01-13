import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CancelConfirmationPage from '../../../appointment-list/pages/CancelAppointmentPage/CancelConfirmationPageV2';
import CancelWarningPage from '../../../appointment-list/pages/CancelAppointmentPage/CancelWarningPageV2';
import {
  selectFeatureTravelPaySubmitMileageExpense,
  selectFeatureTravelPayViewClaimDetails,
} from '../../../redux/selectors';
import { useCancelAppointmentMutation } from '../../../services/appointment/apiSlice';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import AfterVisitSummary from '../../AfterVisitSummary';
import AppointmentCard from '../../AppointmentCard/indexV2';
import AppointmentTasksSection from '../../AppointmentTasksSection';
import BackLink from '../../BackLinkV2';
import ErrorAlert from '../../ErrorAlert';
import FullWidthLayout from '../../FullWidthLayout';
import StatusAlert from '../../StatusAlertV2';
import TravelReimbursementSection from '../../TravelReimbursementSection';
import CancelButton from './CancelButton';

export default function DetailPageLayout({
  children,
  data: appointment,
  heading,
  facility,
}) {
  const { id } = useParams();
  const [isCancelConfirm, setIsCancelConfirm] = React.useState(false);
  const [isCancelWarning, setIsCancelWarning] = React.useState(false);

  // Skip this call when flag is false
  const [
    cancelAppointment,
    { isError, isLoading, isSuccess, isUninitialized },
  ] = useCancelAppointmentMutation();
  const featureTravelPayViewClaimDetails = useSelector(state =>
    selectFeatureTravelPayViewClaimDetails(state),
  );
  const featureTravelPaySubmitMileageExpense = useSelector(state =>
    selectFeatureTravelPaySubmitMileageExpense(state),
  );

  const isNotCanceledAppointment =
    APPOINTMENT_STATUS.cancelled !== appointment.status;

  if (isCancelWarning) {
    return (
      <CancelWarningPage
        data={appointment}
        setIsCancelConfirm={setIsCancelConfirm}
        setIsCancelWarning={setIsCancelWarning}
      />
    );
  }
  if (isCancelConfirm && isUninitialized) {
    cancelAppointment(id);
  }
  if (isCancelConfirm && isLoading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator
          set-focus
          message="Canceling your appointment..."
        />
      </FullWidthLayout>
    );
  }

  if (isCancelConfirm && isSuccess) {
    setIsCancelConfirm(false);
    return <CancelConfirmationPage appointment={appointment} />;
  }

  if (isCancelConfirm && isError) {
    setIsCancelConfirm(false);
    return <h1>Error!!!!</h1>;
  }

  return (
    <>
      <BackLink appointment={appointment} />
      <AppointmentCard appointment={appointment}>
        <h1 className="vaos__dynamic-font-size--h2">
          <span data-dd-privacy="mask">{heading}</span>
        </h1>
        {featureTravelPayViewClaimDetails && (
          <ErrorAlert appointment={appointment} />
        )}
        <StatusAlert appointment={appointment} facility={facility} />
        {featureTravelPaySubmitMileageExpense &&
          featureTravelPayViewClaimDetails &&
          isNotCanceledAppointment && (
            <AppointmentTasksSection appointment={appointment} />
          )}
        {appointment.isPastAppointment &&
          APPOINTMENT_STATUS.booked === appointment.status && (
            <AfterVisitSummary data={appointment} />
          )}
        {children}
        {featureTravelPayViewClaimDetails &&
          isNotCanceledAppointment && (
            <TravelReimbursementSection appointment={appointment} />
          )}
        <div
          className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-margin-top--4 vaos-appts__block-label vaos-hide-for-print"
          style={{ rowGap: '16px' }}
        >
          <div className="vads-u-display--auto vads-u-margin-right--2">
            <VaButton
              text="Print"
              secondary
              onClick={() => window.print()}
              data-testid="print-button"
              uswds
            />
          </div>
          <div className="vads-u-flex--auto">
            <CancelButton
              appointment={appointment}
              setCancelStateFunction={setIsCancelWarning}
            />
          </div>
        </div>
      </AppointmentCard>
    </>
  );
}
DetailPageLayout.propTypes = {
  data: PropTypes.object.isRequired,
  children: PropTypes.node,
  facility: PropTypes.object,
  heading: PropTypes.string,
};
