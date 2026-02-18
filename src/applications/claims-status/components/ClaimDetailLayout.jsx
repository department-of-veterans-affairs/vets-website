import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import {
  buildDateFormatter,
  claimAvailable,
  isClaimOpen,
  isPopulatedClaim,
  generateClaimTitle,
} from '../utils/helpers';
import { setFocus, focusNotificationAlert } from '../utils/page';
import AddingDetails from './AddingDetails';
import NeedHelp from './NeedHelp';
import ClaimsBreadcrumbs from './ClaimsBreadcrumbs';
import ServiceUnavailableAlert from './ServiceUnavailableAlert';
import ClaimContentionList from './ClaimContentionList';
import Notification from './Notification';
import TabNav from './TabNav';
import Type1UnknownUploadError from './Type1UnknownUploadError';

const focusHeader = () => {
  setFocus('.claim-contentions-header');
};

export default function ClaimDetailLayout(props) {
  const { claim, clearNotification, currentTab, loading, message } = props;

  // Get type1UnknownErrors from Redux (only if feature flag is enabled)
  const showDocumentUploadStatus = useSelector(
    state => state.featureToggles?.cst_show_document_upload_status || false,
  );
  const type1UnknownErrors = useSelector(
    state => state.disability.status.notifications.type1UnknownErrors,
  );

  const tabs = ['Status', 'Files', 'Details', 'Overview'];

  // Providing an empty array will show the breadcrumbs for the main claims
  //   list page while the detail page loads (to avoid a flash of incorrect
  //   content).
  let breadcrumbs = [];
  let bodyContent;
  let headingContent;

  if (loading) {
    bodyContent = (
      <va-loading-indicator
        set-focus
        message="Loading your claim information..."
      />
    );
  } else if (claimAvailable(claim)) {
    breadcrumbs = [
      {
        href: '../status',
        label: generateClaimTitle(claim, 'breadcrumb', currentTab),
        isRouterLink: true,
      },
    ];
    const claimTitle = generateClaimTitle(claim, 'detail');
    const { claimDate, closeDate, contentions, status } =
      claim.attributes || {};

    const isOpen = isClaimOpen(status, closeDate);
    const formattedClaimDate = buildDateFormatter()(claimDate);
    const claimSubheader = `Received on ${formattedClaimDate}`;

    headingContent = (
      <>
        <h1 className="claim-title">
          {claimTitle}
          <span className="vads-u-font-family--sans vads-u-margin-top--1">
            {claimSubheader}
          </span>
        </h1>

        {message &&
          !(
            showDocumentUploadStatus &&
            type1UnknownErrors &&
            type1UnknownErrors.length > 0
          ) && (
            <div className="vads-u-margin-top--5">
              <Notification
                title={message.title}
                body={message.body}
                type={message.type}
                maskTitle={message.type === 'error'}
                onClose={() => {
                  focusElement('.claim-title');
                  clearNotification();
                }}
                onSetFocus={focusNotificationAlert}
              />
            </div>
          )}

        {showDocumentUploadStatus &&
          type1UnknownErrors &&
          type1UnknownErrors.length > 0 &&
          (currentTab === 'Files' || currentTab === 'Status') && (
            <div className="vads-u-margin-top--5">
              <Notification
                title="We need you to submit files by mail or in person"
                body={
                  <Type1UnknownUploadError errorFiles={type1UnknownErrors} />
                }
                role="alert"
                type="error"
                onSetFocus={focusNotificationAlert}
              />
            </div>
          )}
        <div className="claim-contentions">
          <h2 className="claim-contentions-header vads-u-font-size--h3">
            What you’ve claimed
          </h2>
          <ClaimContentionList
            contentions={contentions}
            onClick={focusHeader}
          />
          {isPopulatedClaim(claim.attributes || {}) || !isOpen ? null : (
            <AddingDetails />
          )}
        </div>
      </>
    );

    bodyContent = (
      <div className="claim-container">
        <TabNav id={claim.id} />
        {tabs.map(tab => (
          <div key={tab} id={`tabPanel${tab}`} className="tab-panel">
            {currentTab === tab && (
              <div className="tab-content claim-tab-content">
                {props.children}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } else {
    // Will provide a default title, e.g. "Status of your claim"
    breadcrumbs = [
      {
        href: '../status',
        label: generateClaimTitle(null, 'breadcrumb', currentTab),
        isRouterLink: true,
      },
    ];
    bodyContent = (
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

  return (
    <div>
      <div name="topScrollElement" />
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <ClaimsBreadcrumbs crumbs={breadcrumbs} />
          {!!headingContent && <div>{headingContent}</div>}
          <div>{bodyContent}</div>
          <NeedHelp />
        </div>
      </div>
    </div>
  );
}

ClaimDetailLayout.propTypes = {
  children: PropTypes.any,
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  currentTab: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
};
