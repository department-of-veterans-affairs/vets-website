import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { recordAnswer } from '../../actions/universal';
import { useFormRouting } from '../../hooks/useFormRouting';
import { makeSelectVeteranData, makeSelectForm } from '../../selectors';
import AddressBlock from '../../components/AddressBlock';
import TravelPage from '../../components/pages/TravelPage';

const TravelQuestion = props => {
  const { router } = props;
  const { t } = useTranslation();
  const { jumpToPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);

  const onCheck = e => {
    setAgree(e.detail.checked);
  };
  const validation = () => {
    if (agree) {
      dispatch(recordAnswer({ 'travel-question': 'yes' }));
      jumpToPage(`complete/${data.activeAppointmentId}`);
    } else {
      setError(true);
    }
  };
  const fileLater = () => {
    dispatch(recordAnswer({ 'travel-question': 'no' }));
    jumpToPage(`complete/${data.activeAppointmentId}`);
  };
  const agreementLink = e => {
    e.preventDefault();
    jumpToPage('/travel-agreement');
  };
  const startOverAction = e => {
    e.preventDefault();
    jumpToPage('/travel-pay');
  };

  const bodyText = (
    <>
      <p>{t('review-body-text-unified')}</p>
      <div className="vads-u-display--flex vads-u-border-bottom--1px vads-u-align-items--baseline">
        <h2 className="vads-u-margin-top--2p5">{t('claims')}</h2>
      </div>
      <dl className="vads-u-font-family--sans">
        <dt className="vads-u-margin-top--2p5">{t('what-youre-claiming')}</dt>
        <dd className="vads-u-margin-top--0p5" data-testid="claim-list">
          <span data-testid="claim-list">
            {t('mileage-only-reimbursement')}
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
          <AddressBlock address={demographics.homeAddress} />
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
      <div className="vads-u-margin-top--2p5">
        <a
          className="vads-u-margin-left--auto"
          href="travel-pay"
          onClick={e => startOverAction(e)}
          data-testid="review-edit-link"
        >
          {t('start-travel-claim-over')}
        </a>
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
      yesButtonText={t('agree-to-these-terms')}
      yesFunction={validation}
      noButtonText={t('file-later')}
      noFunction={fileLater}
    />
  );
};

TravelQuestion.propTypes = {
  router: PropTypes.object,
};

export default TravelQuestion;
