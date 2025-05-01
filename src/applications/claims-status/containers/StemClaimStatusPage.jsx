import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/* alias the import so it doesn’t collide with the prop name */
import { getStemClaims as getStemClaimsAction } from '../actions';

import StemAskVAQuestions from '../components/StemAskVAQuestions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimsUnavailable from '../components/ClaimsUnavailable';
import StemDeniedDetails from '../components/StemDeniedDetails';
import { setUpPage } from '../utils/page';
import withRouter from '../utils/withRouter';
import { claimAvailable, setDocumentTitle } from '../utils/helpers';

const setTitle = () =>
  setDocumentTitle('Your Edith Nourse Rogers STEM Scholarship application');

const StemClaimStatusPage = ({ claim, loading, getStemClaims }) => {
  /* ----------------------------- mount ---------------------------------- */
  useEffect(
    () => {
      setTitle();
      setUpPage();
      getStemClaims();
    },
    [getStemClaims],
  );

  /* ------------------------- main content ------------------------------ */
  const content = useMemo(
    () => {
      if (loading) {
        return (
          <va-loading-indicator
            set-focus
            message="Loading your claim information..."
          />
        );
      }

      if (claimAvailable(claim)) {
        const {
          deniedAt,
          isEnrolledStem,
          isPursuingTeachingCert,
        } = claim.attributes;
        return (
          <StemDeniedDetails
            deniedAt={deniedAt}
            isEnrolledStem={isEnrolledStem}
            isPursuingTeachingCert={isPursuingTeachingCert}
          />
        );
      }

      return (
        <>
          <h1>We encountered a problem</h1>
          <ClaimsUnavailable headerLevel={2} />
        </>
      );
    },
    [loading, claim],
  );

  /* ---------------------- breadcrumbs ---------------------------------- */
  const crumb = useMemo(
    () => ({
      href: '../status',
      label: 'Your Rogers STEM Scholarship application status details',
      isRouterLink: true,
    }),
    [],
  );

  /* --------------------------- render ---------------------------------- */
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
};

/* ------------------------- redux wiring -------------------------------- */
function mapStateToProps(state, ownProps) {
  const claimsState = state.disability.status;
  const claim =
    claimsState.claimsV2.stemClaims.find(sc => sc.id === ownProps.params.id) ||
    null;

  return {
    loading: claimsState.claimsV2.stemClaimsLoading,
    claim,
  };
}

/* use the aliased name here */
const mapDispatchToProps = { getStemClaims: getStemClaimsAction };

/* --------------------------- prop types -------------------------------- */
StemClaimStatusPage.propTypes = {
  claim: PropTypes.object,
  getStemClaims: PropTypes.func,
  loading: PropTypes.bool,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(StemClaimStatusPage),
);
export { StemClaimStatusPage };
