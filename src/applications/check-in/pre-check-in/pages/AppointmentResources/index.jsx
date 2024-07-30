import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';

import BackButton from '../../../components/BackButton';
import Wrapper from '../../../components/layout/Wrapper';

const AppointmentResources = props => {
  const { router } = props;
  const { goBack } = router;
  const { t } = useTranslation();

  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <>
      <BackButton router={router} action={goBack} prevUrl="#back" />
      <Wrapper pageTitle={t('what-should-i-bring')} withBackButton>
        <div data-testId="resouces-page">
          <p>{t('bring-insurance-cards-and-identification')}</p>
          <p>{t('bring-list-of-medications-including')}</p>
          <ul>
            <li>{t('prescriptions-from-provider')}</li>
            <li>{t('over-the-counter-medications')}</li>
            <li>{t('vitamins-supplements-herbal-remedies')}</li>
            <li>{t('medications-get-in-clinic-or-sample')}</li>
          </ul>
          <p>{t('for-each-include-this')}</p>
          <ul>
            <li>{t('the-name')}</li>
            <li>{t('why-take-it')}</li>
            <li>{t('how-often-how-much')}</li>
            <li>{t('who-prescribed-it')}</li>
          </ul>
          <p>{t('bring-anything-that-might-help')}</p>
          <ul>
            <li>{t('changes-in-medications')}</li>
            <li>{t('problems-questions-concerns')}</li>
            <li>{t('allergies-or-reactions')}</li>
            <li>{t('care-you-receive')}</li>
          </ul>
          <p>{t('you-may-need-to-take-other-steps')}</p>
        </div>
      </Wrapper>
    </>
  );
};

AppointmentResources.propTypes = {
  router: PropTypes.object,
};

export default AppointmentResources;
