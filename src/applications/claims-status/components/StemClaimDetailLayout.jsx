import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import StemAskVAQuestions from './StemAskVAQuestions';

import ClaimsBreadcrumbs from './ClaimsBreadcrumbs';
import ClaimsUnavailable from '../components/ClaimsUnavailable';

import DeniedDetails from './appeals-v2/DeniedDetails';

export default function ClaimDetailLayout(props) {
  const { loading, id, claim } = props;
  const claimsPath = `your-stem-claims/${id}`;

  let bodyContent;
  let headingContent;
  if (loading) {
    bodyContent = (
      <LoadingIndicator setFocus message="Loading your claim information..." />
    );
  } else if (claim) {
    bodyContent = <DeniedDetails claim={claim} />;
  } else {
    bodyContent = (
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
                Your Edith Nourse Rogers STEM Scholarship Application
              </Link>
            </ClaimsBreadcrumbs>
          </div>
        </div>
        {!!headingContent && (
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5">
              {headingContent}
            </div>
          </div>
        )}
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            {bodyContent}
          </div>
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 help-sidebar">
            <StemAskVAQuestions />
          </div>
        </div>
      </div>
    </div>
  );
}

ClaimDetailLayout.propTypes = {
  claim: PropTypes.object,
  loading: PropTypes.bool,
};
