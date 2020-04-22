import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import { isLoggedIn as isLoggedInSelector } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';
import { EBEN_526_URL, BDD_INFO_URL } from '../../constants';

const dateFormat = 'MMMM DD, YYYY';
const ninetyDays = moment()
  .add(90, 'days')
  .format(dateFormat);
const oneHundredEightyDays = moment()
  .add(180, 'days')
  .format(dateFormat);

function alertContent(isLoggedIn) {
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
        still begin the process of filing your claim on eBenefits.
      </p>
      <a
        href={EBEN_526_URL}
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

const UnableToFileBDDPage = ({ isLoggedIn }) => (
  <AlertBox
    status="error"
    headline="You’ll need to file a claim on eBenefits"
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
