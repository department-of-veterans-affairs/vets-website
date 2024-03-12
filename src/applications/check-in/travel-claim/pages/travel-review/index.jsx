import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { makeSelectVeteranAddress } from '../../../selectors';
import { useFormRouting } from '../../../hooks/useFormRouting';
import TravelPage from '../../../components/pages/TravelPage';

const TravelQuestion = props => {
  const { router } = props;
  const { t } = useTranslation();
  const { jumpToPage, goToNextPage, goToPreviousPage } = useFormRouting(router);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(false);
  const selectVeteranAddress = useMemo(makeSelectVeteranAddress, []);
  const address = useSelector(selectVeteranAddress);
  const onEditClick = e => {
    e.preventDefault();
    jumpToPage('/travel-mileage');
  };
  const agreementLink = e => {
    e.preventDefault();
    jumpToPage('/travel-agreement');
  };
  const onCheck = e => {
    setAgree(e.detail.checked);
  };
  const validation = () => {
    if (agree) {
      goToNextPage();
    } else {
      setError(true);
    }
  };

  const bodyText = (
    <>
      <p>{t('you-can-submit-your-claim-now-in-this-tool')}</p>
      <Trans
        i18nKey="if-you-choose-to-file-later"
        components={[<span key="bold" className="vads-u-font-weight--bold" />]}
      />
      <div className="vads-u-display--flex vads-u-border-bottom--1px vads-u-align-items--baseline">
        <h2 className="vads-u-margin-top--2p5">{t('claim-informaiton')}</h2>
        <a
          className="vads-u-margin-left--auto"
          href="travel-vehicle"
          onClick={e => onEditClick(e)}
          data-testid="review-edit-link"
        >
          {t('Edit')}
        </a>
      </div>
      <dl className="vads-u-font-family--sans">
        <dt className="vads-u-margin-top--2p5">{t('what-youre-claiming')}</dt>
        <dd className="vads-u-margin-top--0p5">
          {t('mileage-reimbursement-only')}
        </dd>
        <dt className="vads-u-margin-top--2p5">{t('how-you-traveled')}</dt>
        <dd className="vads-u-margin-top--0p5">{t('in-your-own-vehicle')}</dd>
        <dt className="vads-u-margin-top--2p5">
          {t('where-you-traveled-from')}
        </dt>
        <dd className="vads-u-margin-top--0p5">{address}</dd>
      </dl>
      <div
        className="vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-bottom--4 vads-u-font-family--sans"
        style={{ overflow: 'hidden' }}
      >
        <h3>{t('beneficiary-travel-agreement')}</h3>
        <p>
          <Trans
            i18nKey="penalty-statement"
            components={[
              <span key="bold" className="vads-u-font-weight--bold" />,
            ]}
          />
        </p>
        <VaCheckbox
          description={null}
          error={error ? t('claim-review-error') : null}
          label={t('claim-checkbox-confirm')}
          onVaChange={onCheck}
          checked={agree}
          required
          uswds
        >
          <div slot="description">
            <p>
              <Trans
                i18nKey="by-submitting-this-claim"
                components={[
                  <a
                    data-testid="travel-agreement-link"
                    key="link"
                    aria-label={t('beneficiary-travel-agreement')}
                    href="travel-agreement"
                    onClick={e => agreementLink(e)}
                  />,
                ]}
              />
            </p>
          </div>
        </VaCheckbox>
      </div>
    </>
  );
  return (
    <TravelPage
      header={t('review-your-travel-claim')}
      eyebrow={t('check-in')}
      bodyText={bodyText}
      pageType="travel-review"
      router={router}
      yesButtonText={t('file-claim')}
      yesFunction={validation}
      noButtonText={t('back')}
      noFunction={() => goToPreviousPage()}
    />
  );
};

TravelQuestion.propTypes = {
  router: PropTypes.object,
};

export default TravelQuestion;
