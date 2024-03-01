import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useFormRouting } from '../../hooks/useFormRouting';
import { seeStaffMessageUpdated } from '../../actions/day-of';
import { recordAnswer } from '../../actions/universal';
import DemographicsDisplay from '../../components/pages/demographics/DemographicsDisplay';
import { makeSelectVeteranData } from '../../selectors';
import { useStorage } from '../../hooks/useStorage';
import { URLS } from '../../utils/navigation';
import { APP_NAMES } from '../../utils/appConstants';

const Demographics = props => {
  const dispatch = useDispatch();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { t } = useTranslation();
  const { demographics } = useSelector(selectVeteranData);
  const { router } = props;
  const { goToNextPage, jumpToPage } = useFormRouting(router);
  const { setShouldSendDemographicsFlags } = useStorage(APP_NAMES.CHECK_IN);

  const updateSeeStaffMessage = useCallback(
    seeStaffMessage => {
      dispatch(seeStaffMessageUpdated(seeStaffMessage));
    },
    [dispatch],
  );

  const yesClick = useCallback(
    () => {
      dispatch(recordAnswer({ demographicsUpToDate: 'yes' }));
      setShouldSendDemographicsFlags(window, true);
      goToNextPage();
    },
    [goToNextPage, dispatch, setShouldSendDemographicsFlags],
  );

  const noClick = useCallback(
    () => {
      dispatch(recordAnswer({ demographicsUpToDate: 'no' }));
      setShouldSendDemographicsFlags(window, true);
      const seeStaffMessage = (
        <p>{t('our-staff-can-help-you-update-your-contact-information')}</p>
      );
      updateSeeStaffMessage(seeStaffMessage);
      jumpToPage(URLS.SEE_STAFF);
    },
    [
      updateSeeStaffMessage,
      jumpToPage,
      dispatch,
      t,
      setShouldSendDemographicsFlags,
    ],
  );

  return (
    <>
      <DemographicsDisplay
        demographics={demographics}
        yesAction={yesClick}
        noAction={noClick}
        eyebrow={t('check-in')}
        subtitle={t(
          'we-can-better-follow-up-with-when-we-have-your-current-information',
        )}
        router={router}
      />
    </>
  );
};

Demographics.propTypes = {
  router: PropTypes.object,
};

export default Demographics;
