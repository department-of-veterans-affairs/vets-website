import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import COEIntroPageBox from '../content/COEIntroPageBox';
import LoggedInContent from '../content/LoggedInContent';
import NotLoggedInContent from '../content/NotLoggedInContent';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../shared/constants';
import NeedsToVerify from '../components/NeedsToVerify';
import MissingEDIPI from '../components/MissingEDIPI';

const IntroductionPage = ({
  canApply,
  coe,
  isVerified,
  location,
  loggedIn,
  route,
  status,
}) => {
  let content;
  const pathname = location.basename;

  useEffect(() => {
    focusElement('va-breadcrumbs');
  });
  // Set the content to be the loading indicator
  content = <va-loading-indicator message="Loading your application..." />;

  // Once the coe call is done, render the rest of the content
  const coeCallEnded = [CALLSTATUS.failed, CALLSTATUS.success, CALLSTATUS.skip];

  if (coeCallEnded.includes(status)) {
    if (!loggedIn) {
      content = <NotLoggedInContent route={route} />;
    } else if (!isVerified) {
      content = <NeedsToVerify pathname={pathname} />;
    } else if (!canApply) {
      content = <MissingEDIPI />;
    } else {
      content = (
        <div className="vads-u-margin-bottom--2">
          <COEIntroPageBox
            referenceNumber={coe.referenceNumber}
            requestDate={coe.applicationCreateDate}
            status={coe.status}
          />
          {coe.status !== COE_ELIGIBILITY_STATUS.denied && (
            <LoggedInContent route={route} status={coe.status} />
          )}
        </div>
      );
    }
  }

  return (
    <>
      <FormTitle
        title="Request a VA home loan Certificate of Eligibility (COE)"
        subTitle="Request for a Certificate of Eligibility (VA Form 26-1880)"
      />
      {content}
    </>
  );
};

const mapStateToProps = state => ({
  coe: state.certificateOfEligibility.coe || {},
  loggedIn: isLoggedIn(state),
  status: state.certificateOfEligibility.generateAutoCoeStatus,
  isVerified: selectProfile(state)?.verified || false,
  canApply: selectProfile(state).claims?.coe,
});

IntroductionPage.propTypes = {
  canApply: PropTypes.bool,
  coe: PropTypes.object,
  isVerified: PropTypes.bool,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  route: PropTypes.object,
  status: PropTypes.string,
};

export default connect(mapStateToProps)(IntroductionPage);
