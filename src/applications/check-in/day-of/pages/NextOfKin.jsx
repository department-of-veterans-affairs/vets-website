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
import { URLS } from '../../utils/navigation';

const NextOfKin = props => {
  const { isDayOfDemographicsFlagsEnabled } = props;
  const { router } = props;
  const { t } = useTranslation();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { nextOfKin1: nextOfKin } = demographics;
  const { jumpToPage, goToNextPage, goToPreviousPage } = useFormRouting(router);

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
      if (isDayOfDemographicsFlagsEnabled) {
        dispatch(recordAnswer({ nextOfKinUpToDate: 'yes' }));
      }
      goToNextPage();
    },
    [dispatch, goToNextPage, isDayOfDemographicsFlagsEnabled],
  );

  const noClick = useCallback(
    () => {
      if (isDayOfDemographicsFlagsEnabled) {
        dispatch(recordAnswer({ nextOfKinUpToDate: 'no' }));
      }
      updateSeeStaffMessage(seeStaffMessage);
      jumpToPage(URLS.SEE_STAFF);
    },
    [
      isDayOfDemographicsFlagsEnabled,
      dispatch,
      updateSeeStaffMessage,
      jumpToPage,
      seeStaffMessage,
    ],
  );

  return (
    <>
      <BackButton router={router} action={goToPreviousPage} />
      <NextOfKinDisplay
        nextOfKin={nextOfKin}
        yesAction={yesClick}
        noAction={noClick}
      />
    </>
  );
};

NextOfKin.propTypes = {
  isDayOfDemographicsFlagsEnabled: PropTypes.bool,
  router: PropTypes.object,
};

export default NextOfKin;
