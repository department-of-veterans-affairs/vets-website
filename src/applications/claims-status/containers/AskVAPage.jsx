import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  getClaim as getClaimAction,
  submit5103 as submit5103Action,
} from '../actions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import NeedHelp from '../components/NeedHelp';
import { setDocumentTitle } from '../utils/helpers';
import { setUpPage } from '../utils/page';
import withRouter from '../utils/withRouter';
import { cstMultiClaimProvider } from '../selectors';

function AskVAPage({
  loadingDecisionRequest,
  decisionRequested,
  decisionRequestError,
  getClaim,
  submit5103,
  navigate,
  params = {},
  searchParams,
  cstMultiClaimProviderEnabled,
}) {
  const [submittedDocs, setSubmittedDocs] = useState(false);
  const prevDecisionRequested = useRef(decisionRequested);

  useEffect(() => {
    setDocumentTitle('Ask for your Claim Decision');
    setUpPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToStatusPage() {
    navigate('../status');
  }

  useEffect(
    () => {
      if (decisionRequested && !prevDecisionRequested.current) {
        // TODO: Investigate replacing searchParams?.get('type') with
        // claim?.attributes?.provider sourced from Redux state, consistent
        // with how DocumentRequestPage resolves provider.
        //
        // Current approach (URL query param):
        //   Pros: Simple, no additional Redux wiring needed.
        //   Cons: URL is user-controlled and not validated. A manually crafted
        //         or incorrect type value gets passed directly to the backend,
        //         mismatching the claim's actual provider
        //
        // Alternative approach (Redux claim state):
        //   Pros: Provider value comes from the backend's own response, making
        //         it a verified truth. This is consistent with DocumentRequestPage and AdditionalEvidencePage.
        //   Cons: Requires mapping claim from claimDetail.detail in
        //         mapStateToProps and adding claim to props/propTypes; claim
        //         should already be in Redux by the time this page renders
        //         (loaded by ClaimPage), but that assumption should be validated
        const provider = cstMultiClaimProviderEnabled
          ? searchParams?.get('type')
          : null;
        getClaim(params.id, null, provider);
        goToStatusPage();
      }
      prevDecisionRequested.current = decisionRequested;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [decisionRequested],
  );

  const submitDisabled =
    !submittedDocs || loadingDecisionRequest || decisionRequestError;

  let buttonMsg = 'Submit';
  if (loadingDecisionRequest) {
    buttonMsg = 'Submitting...';
  } else if (decisionRequestError !== null) {
    buttonMsg = 'Something went wrong...';
  }

  const crumbs = [
    {
      href: `../status`,
      label: 'Status details',
      isRouterLink: true,
    },
    {
      href: `../ask-va-to-decide`,
      label: 'Ask for your claim decision',
      isRouterLink: true,
    },
  ];

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0  vads-u-margin-bottom--7">
      <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12">
          <ClaimsBreadcrumbs crumbs={crumbs} />
        </div>
      </div>
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <div className="vads-u-padding-x--2p5 vads-u-padding-bottom--4">
            <h1>Ask for your claim decision</h1>
            <p className="first-of-type">
              We sent you a letter in the mail asking for more evidence to your
              claim. We’ll wait 30 days for your evidence. If you don’t have
              anything more you want to submit, let us know and go ahead and
              make a decision on your claim.
            </p>
            <p>Taking the full 30 days won’t affect:</p>
            <ul>
              <li>Whether you get VA benefits</li>
              <li>The payment amount</li>
              <li>
                Whether you get our help to gather evidence to support your
                claim
              </li>
              <li>The date benefits will begin if we approve your claim</li>
            </ul>
            <p>
              If you have submitted all evidence that will support your claim,
              the VA will make a decision on your claim based on the information
              already provided.
            </p>
            <VaCheckbox
              className="claims-alert-checkbox vads-u-padding-top--1 vads-u-padding-bottom--2"
              checked={submittedDocs}
              label="I have submitted all evidence that supports my claim"
              onVaChange={e => setSubmittedDocs(e.detail.checked)}
            />
            <va-button
              disabled={submitDisabled}
              submit
              class="button-primary vads-u-margin-top--1"
              text={buttonMsg}
              onClick={() => submit5103(params.id)}
            />
            {!loadingDecisionRequest ? (
              <va-button
                secondary
                class="button-secondary vads-u-margin-top--1"
                text="Not yet–I still have more evidence to submit"
                onClick={goToStatusPage}
              />
            ) : null}
          </div>
          <div className="vads-u-padding-x--2p5">
            <NeedHelp />
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  return {
    loadingDecisionRequest: claimsState.claimAsk.loadingDecisionRequest,
    decisionRequested: claimsState.claimAsk.decisionRequested,
    decisionRequestError: claimsState.claimAsk.decisionRequestError,
    cstMultiClaimProviderEnabled: cstMultiClaimProvider(state),
  };
}

const mapDispatchToProps = {
  getClaim: getClaimAction,
  submit5103: submit5103Action,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AskVAPage),
);

AskVAPage.propTypes = {
  cstMultiClaimProviderEnabled: PropTypes.bool,
  decisionRequestError: PropTypes.string,
  decisionRequested: PropTypes.bool,
  getClaim: PropTypes.func,
  loadingDecisionRequest: PropTypes.bool,
  navigate: PropTypes.func,
  params: PropTypes.object,
  searchParams: PropTypes.object,
  submit5103: PropTypes.func,
};

export { AskVAPage };
