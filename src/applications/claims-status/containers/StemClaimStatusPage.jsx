import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getStemClaims } from '../actions';
import StemAskVAQuestions from '../components/StemAskVAQuestions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimsUnavailable from '../components/ClaimsUnavailable';
import StemDeniedDetails from '../components/StemDeniedDetails';
import { setUpPage } from '../utils/page';
import withRouter from '../utils/withRouter';
import { claimAvailable, setDocumentTitle } from '../utils/helpers';

const setTitle = () => {
  setDocumentTitle('Your Edith Nourse Rogers STEM Scholarship application');
};

class StemClaimStatusPage extends React.Component {
  componentDidMount() {
    setTitle();
    setUpPage();
    this.props.getStemClaims();
  }

  render() {
    const { claim, loading } = this.props;
    let content;
    if (loading) {
      content = (
        <va-loading-indicator
          set-focus
          message="Loading your claim information..."
        />
      );
    } else if (claimAvailable(claim)) {
      const {
        deniedAt,
        isEnrolledStem,
        isPursuingTeachingCert,
      } = claim.attributes;

      content = (
        <StemDeniedDetails
          deniedAt={deniedAt}
          isEnrolledStem={isEnrolledStem}
          isPursuingTeachingCert={isPursuingTeachingCert}
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

    const crumb = {
      href: `../status`,
      label: 'Your Rogers STEM Scholarship application status details',
      isRouterLink: true,
    };

    return (
      <div>
        <div name="topScrollElement" />
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12">
              <ClaimsBreadcrumbs crumbs={[crumb]} />
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

function mapStateToProps(state, ownProps) {
  const claimsState = state.disability.status;
  const claim = claimsState.claimsV2.stemClaims.filter(
    stemClaim => stemClaim.id === ownProps.params.id,
  )[0];
  return {
    loading: claimsState.claimsV2.stemClaimsLoading,
    claim,
  };
}

const mapDispatchToProps = {
  getStemClaims,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(StemClaimStatusPage),
);

StemClaimStatusPage.propTypes = {
  claim: PropTypes.object,
  getStemClaims: PropTypes.func,
  loading: PropTypes.bool,
  params: PropTypes.object,
};

export { StemClaimStatusPage };
