import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';

import BackButton from '../../components/BackButton';
import Wrapper from '../../components/layout/Wrapper';

import { makeSelectSeeStaffMessage } from '../../selectors';
import TravelPayReimbursementLink from '../../components/TravelPayReimbursementLink';
import { useSendDemographicsFlags } from '../../hooks/useSendDemographicsFlags';

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
      <BackButton router={router} action={goBack} prevUrl="#back" />
      <Wrapper pageTitle={t('check-in-with-a-staff-member')} withBackButton>
        {message ? (
          <span>{message}</span>
        ) : (
          <p>{t('our-staff-can-help-you-update-your-contact-information')}</p>
        )}
        <TravelPayReimbursementLink />
      </Wrapper>
    </>
  );
};

SeeStaff.propTypes = {
  router: PropTypes.object,
};

export default SeeStaff;
