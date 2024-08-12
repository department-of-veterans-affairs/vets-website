import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { utcToZonedTime } from 'date-fns-tz';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { makeSelectVeteranAddress, makeSelectForm } from '../../../selectors';
import { useFormRouting } from '../../../hooks/useFormRouting';
import TravelPage from '../../../components/pages/TravelPage';

const TravelReview = props => {
  const { router } = props;
  const { t } = useTranslation();
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { appointmentToFile } = data;
  const { jumpToPage, goToNextPage } = useFormRouting(router);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(false);
  const selectVeteranAddress = useMemo(makeSelectVeteranAddress, []);
  const address = useSelector(selectVeteranAddress);
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
  const startOverAction = () => {
    jumpToPage('/travel-mileage');
  };

  const bodyText = (
    <div data-testid="review-body">
      <p>{t('you-can-submit-your-claim-now-in-this-tool')}</p>
      <Trans
        i18nKey="if-you-choose-to-file-later"
        components={[<span key="bold" className="vads-u-font-weight--bold" />]}
      />
      <div className="vads-u-display--flex vads-u-border-bottom--1px vads-u-align-items--baseline">
        <h2 className="vads-u-margin-top--2p5">{t('claims')}</h2>
      </div>
      <dl className="vads-u-font-family--sans">
        <dt className="vads-u-margin-top--2p5">{t('what-youre-claiming')}</dt>
        <dd className="vads-u-margin-top--0p5">
          <span data-testid="claim-info">
            {`${t('mileage-only-reimbursement-for-your', {
              facility: appointmentToFile.facility,
              provider: appointmentToFile.doctorName
                ? ` ${'with'} ${appointmentToFile.doctorName}`
                : '',
              date: {
                date: utcToZonedTime(
                  appointmentToFile.startTime,
                  appointmentToFile.timezone,
                ),
                timezone: appointmentToFile.timezone,
              },
            })}${
              appointmentToFile.clinicFriendlyName
                ? `, ${appointmentToFile.clinicFriendlyName}`
                : ''
            }`}
          </span>
        </dd>
      </dl>
      <div className="vads-u-display--flex vads-u-border-bottom--1px vads-u-align-items--baseline">
        <h2 className="vads-u-margin-top--2p5">{t('travel-method')}</h2>
      </div>
      <dl className="vads-u-font-family--sans">
        <dt className="vads-u-margin-top--2p5">{t('how-you-traveled')}</dt>
        <dd className="vads-u-margin-top--0p5">{t('in-your-own-vehicle')}</dd>
      </dl>
      <div className="vads-u-display--flex vads-u-border-bottom--1px vads-u-align-items--baseline">
        <h2 className="vads-u-margin-top--2p5">{t('starting-address')}</h2>
      </div>
      <dl className="vads-u-font-family--sans">
        <dt className="vads-u-margin-top--2p5">
          {t('where-you-traveled-from')}
        </dt>
        <dd className="vads-u-margin-top--0p5 vads-u-margin-bottom--5">
          {address}
        </dd>
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
    </div>
  );
  return (
    <TravelPage
      header={t('review-your-travel-claim')}
      bodyText={bodyText}
      pageType="travel-review"
      router={router}
      yesButtonText={t('file-claim')}
      yesFunction={validation}
      noButtonText={t('start-over')}
      noFunction={startOverAction}
      testID="travel-claim-review-page"
    />
  );
};

TravelReview.propTypes = {
  router: PropTypes.object,
};

export default TravelReview;
