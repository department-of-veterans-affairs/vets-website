import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { useFormRouting } from '../../hooks/useFormRouting';
import BackToHome from '../../components/BackToHome';
import LanguagePicker from '../../components/LanguagePicker';
import Footer from '../../components/Footer';
import { seeStaffMessageUpdated } from '../../actions/day-of';
import DemographicsDisplay from '../../components/pages/demographics/DemographicsDisplay';
import { makeSelectVeteranData } from '../../selectors';

import { URLS } from '../../utils/navigation';

const Demographics = props => {
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { t } = useTranslation();
  const { demographics } = useSelector(selectVeteranData);
  const { router } = props;
  const { goToNextPage, jumpToPage, goToErrorPage } = useFormRouting(router);

  const dispatch = useDispatch();
  const updateSeeStaffMessage = useCallback(
    seeStaffMessage => {
      dispatch(seeStaffMessageUpdated(seeStaffMessage));
    },
    [dispatch],
  );

  const yesClick = useCallback(() => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'yes-to-demographic-information',
    });
    goToNextPage();
  }, [goToNextPage]);

  const noClick = useCallback(() => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'no-to-demographic-information',
    });
    const seeStaffMessage = (
      <>
        <p>{t('our-staff-can-help-you-update-your-contact-information')}</p>
        <p className="vads-u-margin-bottom--0">
          {t(
            'if-you-dont-live-at-a-fixed-address-right-now-well-help-you-find-the-best-way-to-stay-connected-with-us',
          )}
        </p>
      </>
    );
    updateSeeStaffMessage(seeStaffMessage);
    jumpToPage(URLS.SEE_STAFF);
  }, [updateSeeStaffMessage, jumpToPage]);

  if (!demographics) {
    goToErrorPage();
    return <></>;
  }
  return (
    <>
      <DemographicsDisplay
        demographics={demographics}
        yesAction={yesClick}
        noAction={noClick}
        Footer={Footer}
      />
      <BackToHome />
      <LanguagePicker />
    </>
  );
};

Demographics.propTypes = {
  router: PropTypes.object,
};

export default Demographics;
