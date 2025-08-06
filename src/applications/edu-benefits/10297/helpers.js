import React from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

export const ConfirmationWhatsNextProcessList = () => (
  <>
    <h2>What to expect next</h2>
    <va-process-list>
      <va-process-list-item header="We'll review your application and determine your eligibility">
        <p>
          If you’re eligible and the yearly cap of 4,000 students hasn’t been
          met, we’ll send you a Certificate of Eligibility. If not, we’ll send
          you a letter explaining why you’re not eligible.
        </p>
      </va-process-list-item>
      <va-process-list-item header="We'll check the training provider(s) you listed">
        <p>
          If you reported a school you want to attend, we’ll review whether that
          school has programs currently approved for the High Technology
          Program. If it doesn’t, we’ll reach out to the school to explore if
          approval can be set up.
        </p>
      </va-process-list-item>
      <va-process-list-item header="We'll keep you updated">
        <p>
          You’ll get an email with our decision. If you’re signed up for VA
          Notify, we’ll also send updates there.
        </p>
      </va-process-list-item>
    </va-process-list>
  </>
);

export const ConfirmationHowToContact = () => (
  <p>
    If you have questions about this form or need help, you can submit a request
    through <va-link external href="https://ask.va.gov/" text="Ask VA" />
  </p>
);

export const ConfirmationGoBackLink = () => (
  <div
    className={classNames(
      'confirmation-go-back-link-section',
      'screen-only',
      'vads-u-margin-top--2',
    )}
  >
    <va-link-action href="/" text="Go back to VA.gov homepage" type="primary" />
  </div>
);

export const EligibleIcon = ({ isEligible }) => {
  const icon = isEligible ? 'check' : 'close';
  const classes = classNames('icon-li', {
    'vads-u-color--green': isEligible,
    'vads-u-color--gray-medium': !isEligible,
  });

  return (
    <span className={classes}>
      <va-icon icon={icon} size={3} />
    </span>
  );
};

EligibleIcon.propTypes = {
  isEligible: PropTypes.bool,
};

// Expects a birthDate as a string in YYYY-MM-DD format
export const getAgeInYears = birthDate =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

export const getEligibilityStatus = formData => {
  const validDutyRequirements = ['atLeast3Years', 'byDischarge'];

  const isDutyEligible = validDutyRequirements.includes(
    formData?.dutyRequirement,
  );
  const isDobEligible = !!(
    formData?.dateOfBirth && getAgeInYears(formData?.dateOfBirth) < 62
  );
  const isDischargeEligible = formData?.otherThanDishonorableDischarge === true;
  const isFullyEligible =
    isDutyEligible && isDobEligible && isDischargeEligible;

  return {
    isDutyEligible,
    isDobEligible,
    isDischargeEligible,
    isFullyEligible,
  };
};

export const getCardDescription = item => {
  return item ? (
    <>
      <div className=" vads-u-margin-y--2" data-testid="card-street">
        <p>{item?.providerAddress?.street}</p>
        <p data-testid="card-address">
          {`${item?.providerAddress?.city}${
            item?.providerAddress?.state ||
            item?.providerAddress?.postalCode !== 'NA'
              ? ','
              : ''
          }`}
          {item?.providerAddress?.state
            ? ` ${item?.providerAddress?.state}`
            : ''}
          {item?.providerAddress?.postalCode !== 'NA'
            ? ` ${item?.providerAddress?.postalCode}`
            : ''}
        </p>
      </div>
    </>
  ) : null;
};

export const trainingProviderArrayOptions = {
  arrayPath: 'trainingProviders',
  nounSingular: 'training provider',
  nounPlural: 'training providers',
  required: false,
  isItemIncomplete: item => {
    return (
      !item?.providerName ||
      !item?.providerAddress?.street ||
      !item?.providerAddress?.city ||
      !item?.providerAddress?.country ||
      !item?.providerAddress?.postalCode
    );
  },
  maxItems: 4,
  text: {
    getItemName: item =>
      item?.providerName ? `${item?.providerName}`.trim() : 'training provider',
    cardDescription: item => getCardDescription(item),
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding information',
    summaryTitle: 'Review your training provider information',
    cancelAddButtonText: 'Cancel adding this training provider',
  },
};

const MS_IN_DAY = 86_400_000;
const MAX_FUTURE_DAYS = 180;

export const validateWithin180Days = (errors, dateString) => {
  if (!dateString) return;
  const picked = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (picked < today) errors.addError('Date can’t be in the past.');

  if (picked - today > MAX_FUTURE_DAYS * MS_IN_DAY)
    errors.addError(
      'This date is more than 180 days away. You must be within 180 days of discharge to be eligible for the program.',
    );
};

export const validateTrainingProviderStartDate = (errors, dateString) => {
  if (!dateString) return;
  const picked = new Date(`${dateString}T00:00:00`);
  const startDate = new Date('2025-01-02T00:00:00');

  if (picked < startDate)
    errors.addError(
      'Training must start on or after 1/2/2025 to qualify for VET TEC 2.0',
    );
};
