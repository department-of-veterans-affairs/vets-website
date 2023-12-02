import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { useFormRouting } from '../../hooks/useFormRouting';

import { makeSelectVeteranData } from '../../selectors';
import AddressBlock from '../../components/AddressBlock';
import TravelPage from '../../components/pages/TravelPage';

const TravelQuestion = props => {
  const { router } = props;
  const { t } = useTranslation();
  const { jumpToPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);

  const onEditClick = e => {
    e.preventDefault();
    jumpToPage('/travel-vehicle');
  };
  const bodyText = (
    <>
      <p>{t('review-body-text')}</p>
      <div className="vads-u-display--flex vads-u-border-bottom--1px vads-u-align-items--baseline">
        <h2>{t('claim-informaiton')}</h2>
        <a
          className="vads-u-margin-left--auto"
          href="travel-vehicle"
          onClick={e => onEditClick(e)}
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
        <dd className="vads-u-margin-top--0p5">
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
        <va-checkbox
          description={null}
          error={t('claim-review-error')}
          hint={null}
          label={t('claim-checkbox-confirm')}
          onBlur={() => {}}
          required
        >
          <div slot="description">
            <p>{t('by-submitting-claim')}</p>
            <va-additional-info
              uswds
              trigger={t('beneficiary-travel-agreement')}
            >
              <span className="vads-u-font-weight--bold">
                {t('please-review')}
              </span>
              <ul>
                <Trans
                  i18nKey="certify-statements"
                  components={[<li key="list-item" />]}
                />
              </ul>
            </va-additional-info>
          </div>
        </va-checkbox>
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
    />
  );
};

TravelQuestion.propTypes = {
  router: PropTypes.object,
};

export default TravelQuestion;
