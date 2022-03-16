import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { useFormRouting } from '../../hooks/useFormRouting';
import BackButton from '../../components/BackButton';
import BackToHome from '../../components/BackToHome';
import LanguagePicker from '../../components/LanguagePicker';
import Footer from '../../components/Footer';
import { seeStaffMessageUpdated } from '../../actions/day-of';
import NextOfKinDisplay from '../../components/pages/nextOfKin/NextOfKinDisplay';
import { makeSelectVeteranData } from '../../selectors';
import { URLS } from '../../utils/navigation';

const NextOfKin = props => {
  const { router } = props;
  const { t } = useTranslation();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { nextOfKin1: nextOfKin } = demographics;
  const {
    jumpToPage,
    goToNextPage,
    goToPreviousPage,
    goToErrorPage,
  } = useFormRouting(router);

  const seeStaffMessage = t(
    'our-staff-can-help-you-update-your-next-of-kin-information',
  );
  const dispatch = useDispatch();
  const updateSeeStaffMessage = useCallback(
    message => {
      dispatch(seeStaffMessageUpdated(message));
    },
    [dispatch],
  );

  const yesClick = useCallback(() => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'yes-to-next-of-kin-information',
    });
    goToNextPage();
  }, [goToNextPage]);

  const noClick = useCallback(() => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'no-to-next-of-kin-information',
    });
    updateSeeStaffMessage(seeStaffMessage);
    jumpToPage(URLS.SEE_STAFF);
  }, [updateSeeStaffMessage, jumpToPage]);

  if (!nextOfKin) {
    goToErrorPage();
    return <></>;
  }
  return (
    <>
      <BackButton router={router} action={goToPreviousPage} />
      <NextOfKinDisplay
        nextOfKin={nextOfKin}
        yesAction={yesClick}
        noAction={noClick}
        Footer={Footer}
      />
      <BackToHome />
      <LanguagePicker />
    </>
  );
};

NextOfKin.propTypes = {
  router: PropTypes.object,
};

export default NextOfKin;
