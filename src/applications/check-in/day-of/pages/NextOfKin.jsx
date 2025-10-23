import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { useFormRouting } from '../../hooks/useFormRouting';
import BackButton from '../../components/BackButton';
import { seeStaffMessageUpdated } from '../../actions/day-of';
import { recordAnswer } from '../../actions/universal';
import NextOfKinDisplay from '../../components/pages/nextOfKin/NextOfKinDisplay';
import { makeSelectVeteranData } from '../../selectors';
import { useStorage } from '../../hooks/useStorage';
import { URLS } from '../../utils/navigation';
import { APP_NAMES } from '../../utils/appConstants';

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
    getPreviousPageFromRouter,
  } = useFormRouting(router);
  const { setShouldSendDemographicsFlags } = useStorage(APP_NAMES.CHECK_IN);

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

  const yesClick = useCallback(
    () => {
      dispatch(recordAnswer({ nextOfKinUpToDate: 'yes' }));
      setShouldSendDemographicsFlags(window, true);
      goToNextPage();
    },
    [dispatch, goToNextPage, setShouldSendDemographicsFlags],
  );

  const noClick = useCallback(
    () => {
      dispatch(recordAnswer({ nextOfKinUpToDate: 'no' }));
      setShouldSendDemographicsFlags(window, true);
      updateSeeStaffMessage(seeStaffMessage);
      jumpToPage(URLS.SEE_STAFF);
    },
    [
      dispatch,
      updateSeeStaffMessage,
      jumpToPage,
      seeStaffMessage,
      setShouldSendDemographicsFlags,
    ],
  );

  return (
    <>
      <BackButton
        router={router}
        action={goToPreviousPage}
        prevUrl={getPreviousPageFromRouter()}
      />
      <NextOfKinDisplay
        nextOfKin={nextOfKin}
        eyebrow={t('check-in')}
        yesAction={yesClick}
        noAction={noClick}
        router={router}
      />
    </>
  );
};

NextOfKin.propTypes = {
  router: PropTypes.object,
};

export default NextOfKin;
