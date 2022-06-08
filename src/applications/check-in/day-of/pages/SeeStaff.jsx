import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/layout/Footer';
import BackButton from '../../components/BackButton';
import LanguagePicker from '../../components/LanguagePicker';

import { makeSelectSeeStaffMessage } from '../../selectors';
import TravelPayReimbursementLink from '../../components/TravelPayReimbursementLink';
import useSendDemographicsFlags from '../../hooks/useSendDemographicsFlags';
import MixedLanguageDisclaimer from '../../components/MixedLanguageDisclaimer';

const SeeStaff = props => {
  const { router } = props;
  const { goBack } = router;
  const { t } = useTranslation();
  const selectSeeStaffMessage = useMemo(makeSelectSeeStaffMessage, []);
  const { message } = useSelector(selectSeeStaffMessage);
  useSendDemographicsFlags();

  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <>
      <BackButton router={router} action={goBack} />
      <div className="vads-l-grid-container vads-u-padding-top--3 vads-u-padding-bottom--3">
        <MixedLanguageDisclaimer />
        <LanguagePicker />
        <h1 tabIndex="-1" className="vads-u-margin-top--2">
          {t('check-in-with-a-staff-member')}
        </h1>
        {message ? (
          <span>{message}</span>
        ) : (
          <p>{t('our-staff-can-help-you-update-your-contact-information')}</p>
        )}
        <TravelPayReimbursementLink />
        <Footer />
        <BackToHome />
      </div>
    </>
  );
};

SeeStaff.propTypes = {
  router: PropTypes.object,
};

export default SeeStaff;
