import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getStemClaims } from '../actions';
import StemAskVAQuestions from '../components/StemAskVAQuestions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ServiceUnavailableAlert from '../components/ServiceUnavailableAlert';
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
          <ServiceUnavailableAlert
            headerLevel={2}
            services={['claims']}
            useSingular
          />
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
        <div className="row">
          <div className="usa-width-two-thirds medium-8 column">
            <ClaimsBreadcrumbs crumbs={[crumb]} />
          </div>
        </div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 column">{content}</div>
          <div className="usa-width-one-third medium-4 column">
            <StemAskVAQuestions />
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
