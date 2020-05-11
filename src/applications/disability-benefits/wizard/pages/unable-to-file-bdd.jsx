import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import { isLoggedIn as isLoggedInSelector } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';
import { EBEN_526_PATH, BDD_INFO_URL } from '../../constants';
import { DISABILITY_526_V2_ROOT_URL } from 'applications/disability-benefits/all-claims/constants';

import environment from 'platform/utilities/environment';

const dateFormat = 'MMMM DD, YYYY';
const ninetyDays = moment()
  .add(90, 'days')
  .format(dateFormat);
const oneHundredEightyDays = moment()
  .add(180, 'days')
  .format(dateFormat);

function alertContent(isLoggedIn) {
  if (environment.isProduction()) {
    return (
      <>
        <p>
          <strong>
            If your separation date is between {ninetyDays} and{' '}
            {oneHundredEightyDays}
          </strong>{' '}
          (90 and 180 days from today), you can file a disability claim through
          the Benefits Delivery at Discharge (BDD) program.
        </p>
        <p>
          <strong>If your separation date is before {ninetyDays},</strong> you
          can't file a BDD claim, but you can still begin the process of filing
          your claim on eBenefits.
        </p>
        <a
          href={EBEN_526_PATH}
          className="usa-button-primary va-button-primary"
          onClick={() =>
            isLoggedIn && recordEvent({ event: 'nav-ebenefits-click' })
          }
        >
          Go to eBenefits
        </a>
        <p>
          <a href={BDD_INFO_URL}>Learn more about the BDD program</a>
        </p>
      </>
    );
  }
  return (
    <>
      <p>
        <strong>
          If your separation date is before {ninetyDays} or after{' '}
          {oneHundredEightyDays},
        </strong>{' '}
        you can’t file a BDD claim.
      </p>
      <p>
        <strong>If your separation date is before {ninetyDays},</strong> you can
        still begin the process of filing your claim. It will begin processing
        the day after you separate from military service.
      </p>
      <a
        href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
        className="usa-button-primary va-button-primary"
      >
        File a disability compensation claim
      </a>
      <p>
        <a href={BDD_INFO_URL}>Learn more about the BDD program</a>
      </p>
    </>
  );
}

const UnableToFileBDDPage = ({ isLoggedIn }) =>
  environment.isProduction() ? (
    <AlertBox
      status="warning"
      headline="You’ll need to file a claim on eBenefits"
      content={alertContent(isLoggedIn)}
    />
  ) : (
    <AlertBox
      status="warning"
      headline="You can't file a BDD claim"
      content={alertContent(isLoggedIn)}
    />
  );

const mapStateToProps = state => ({
  isLoggedIn: isLoggedInSelector(state),
});

export default {
  name: pageNames.unableToFileBDD,
  component: connect(mapStateToProps)(UnableToFileBDDPage),
};
