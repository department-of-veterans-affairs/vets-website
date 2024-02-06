import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setUpPage } from '../utils/page';

import StemAskVAQuestions from '../components/StemAskVAQuestions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimsUnavailable from '../components/ClaimsUnavailable';
import StemDeniedDetails from '../components/StemDeniedDetails';
import { getStemClaims } from '../actions';

class StemClaimStatusPage extends React.Component {
  componentDidMount() {
    this.setTitle();
    setUpPage();
    this.props.getStemClaims();
  }

  setTitle() {
    document.title = 'Your Edith Nourse Rogers STEM Scholarship application';
  }

  render() {
    const { claim, loading } = this.props;
    const claimsPath = `your-stem-claims/${this.props.params.id}`;
    let content;
    if (loading) {
      content = (
        <va-loading-indicator
          set-focus
          message="Loading your claim information..."
          uswds="false"
        />
      );
    } else if (claim) {
      const claimAttributes = claim.attributes;
      content = (
        <StemDeniedDetails
          deniedAt={claimAttributes.deniedAt}
          isEnrolledStem={claimAttributes.isEnrolledStem}
          isPursuingTeachingCert={claimAttributes.isPursuingTeachingCert}
        />
      );
    } else {
      content = (
        <>
          <h1>We encountered a problem</h1>
          <ClaimsUnavailable headerLevel={2} />
        </>
      );
    }

    return (
      <div>
        <div name="topScrollElement" />
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12">
              <ClaimsBreadcrumbs>
                <Link to={claimsPath}>
                  Your Rogers STEM Scholarship application status details
                </Link>
              </ClaimsBreadcrumbs>
            </div>
          </div>
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              {content}
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 help-sidebar">
              <StemAskVAQuestions />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const claimsState = state.disability.status;
  const claim = claimsState.claimsV2.stemClaims.filter(
    stemClaim => stemClaim.id === props.params.id,
  )[0];
  return {
    loading: claimsState.claimsV2.stemClaimsLoading,
    claim,
  };
}

const mapDispatchToProps = {
  getStemClaims,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StemClaimStatusPage);

export { StemClaimStatusPage };
