import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';
import { scrollAndFocus } from 'platform/utilities/scroll';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getEligibilityStatus } from '../helpers';

const EligibleIcon = ({ isEligible }) => {
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

const EligibilitySummaryInfo = ({ goBack, goForward }) => {
  const formData = useSelector(state => state.form?.data);

  const {
    isDutyEligible,
    isDobEligible,
    isDischargeEligible,
    isFullyEligible,
  } = getEligibilityStatus(formData);

  const headerText = isFullyEligible
    ? 'Based on your response, you are eligible.'
    : 'Based on your response, you may not be eligible.';

  const dutyText = isDutyEligible ? (
    <span>
      I'm a service member within 180 days of discharge who has or will have 3
      years (36 months) by their discharge date
    </span>
  ) : (
    <div>
      <span className="vads-u-margin-bottom--neg1px">
        These statements do not apply to me
      </span>
      <ul className="vads-u-margin-y--0 duty-ul">
        <li className="vads-u-margin-y--0">
          A Veteran who served at least 3 years (36 months) on active duty;
          <p className="vads-u-margin-y--0">
            <strong>or</strong>
          </p>
        </li>
        <li className="vads-u-margin-y--0">
          A service member within 180 days of discharge who has or will have 3
          years (36 months) by their discharge date
        </li>
      </ul>
    </div>
  );

  const dobText = isDobEligible ? (
    <span>I am under the age of 62</span>
  ) : (
    <span>I am over the age of 62</span>
  );
  const dischargeText = isDischargeEligible ? (
    <span>I received a discharge under conditions other than dishonorable</span>
  ) : (
    <span>
      I did not receive a discharge under conditions other than dishonorable
    </span>
  );

  useEffect(() => {
    const title = document.querySelector('.schemaform-block-title > h3');
    scrollAndFocus(title);
  }, []);

  const renderItem = (isEligible, text) => (
    <li className="vads-u-position--relative">
      <EligibleIcon isEligible={isEligible} />
      {text}
    </li>
  );

  return (
    <div>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
            High Technology Program eligibility summary
          </h3>
        </legend>
      </fieldset>

      <div className="eligibility-summary">
        <div className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--2">
          <h4 className="vads-u-margin-top--0">{headerText}</h4>
          <p className="vads-u-margin-y--2">
            <strong>Your responses:</strong>
          </p>
          <ul className="vads-u-padding-left--0 vads-u-margin-left--3 vads-u-margin-top--0p5 eligibility-ul">
            {renderItem(isDutyEligible, dutyText)}
            {renderItem(isDobEligible, dobText)}
            {renderItem(isDischargeEligible, dischargeText)}
          </ul>
        </div>
        {!isFullyEligible && (
          <>
            <p>
              <strong>
                You must meet the above requirements to qualify for the program.
              </strong>{' '}
              Please consider that ineligible applications delay the processing
              of benefits for eligible applicants.
            </p>
            <va-link-action href="/" text="Exit application" type="primary" />
          </>
        )}
      </div>

      <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
        <div className="small-6 medium-5 columns">
          <ProgressButton
            onButtonClick={goBack}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
          />
        </div>
        {isFullyEligible && (
          <div className="small-6 medium-5 columns">
            <ProgressButton
              onButtonClick={goForward}
              buttonText="Continue"
              buttonClass="usa-button-primary"
              afterText="»"
            />
          </div>
        )}
      </div>
    </div>
  );
};

EligibilitySummaryInfo.propTypes = {
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default EligibilitySummaryInfo;
