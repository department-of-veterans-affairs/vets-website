import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import { isLoggedIn as isLoggedInSelector } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';

class FileOriginalClaimPage extends React.Component {
  render() {
    return (
      <AlertBox
        status="error"
        headline="You’ll need to file a claim on eBenefits"
        content={
          <>
            <p>
              To file your first disability claim, please go to our eBenefits
              website.
            </p>
            <a
              href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation"
              className="usa-button-primary va-button-primary"
              onClick={() =>
                this.props.isLoggedIn &&
                recordEvent({
                  event: 'nav-ebenefits-click',
                })
              }
            >
              Go to eBenefits
            </a>
          </>
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: isLoggedInSelector(state),
  };
}

export default {
  name: pageNames.fileOriginalClaim,
  component: connect(mapStateToProps)(FileOriginalClaimPage),
};
