import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import { isLoggedIn as isLoggedInSelector } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';

function alertContent({ isLoggedIn }) {
  return (
    <>
      <p>
        To file your first disability claim, please go to our eBenefits website.
      </p>
      <a
        href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation"
        className="usa-button-primary va-button-primary"
        onClick={() =>
          isLoggedIn &&
          recordEvent({
            event: 'ebenefits-navigation',
          })
        }
      >
        Go to eBenefits
      </a>
    </>
  );
}
const mapStateToProps = state => ({
  isLoggedIn: isLoggedInSelector(state),
});
const FileOriginalClaimPage = () => (
  <AlertBox
    status="error"
    headline="You’ll need to file a claim on eBenefits"
    content={connect(mapStateToProps)(alertContent)}
  />
);
export default {
  name: pageNames.fileOriginalClaim,
  component: FileOriginalClaimPage,
};
