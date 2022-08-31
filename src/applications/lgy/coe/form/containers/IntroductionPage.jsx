import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import COEIntroPageBox from './introduction-content/COEIntroPageBox';
import LoggedInContent from './introduction-content/LoggedInContent';
import NotLoggedInContent from './introduction-content/NotLoggedInContent';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../shared/constants';

const IntroductionPage = ({ coe, loggedIn, route, status }) => {
  let content;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });
  // Set the content to be the loading indicator
  content = <va-loading-indicator message="Loading your application..." />;

  // Once the coe call is done, render the rest of the content
  const coeCallEnded = [CALLSTATUS.failed, CALLSTATUS.success, CALLSTATUS.skip];

  if (!loggedIn && coeCallEnded.includes(status)) {
    content = <NotLoggedInContent route={route} />;
  }
  if (loggedIn && coeCallEnded.includes(status)) {
    content = (
      <>
        <COEIntroPageBox
          referenceNumber={coe.referenceNumber}
          requestDate={coe.applicationCreateDate}
          status={coe.status}
        />
        {coe.status !== COE_ELIGIBILITY_STATUS.denied && (
          <LoggedInContent route={route} status={coe.status} />
        )}
      </>
    );
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
});

IntroductionPage.propTypes = {
  coe: PropTypes.object,
  loggedIn: PropTypes.bool,
  route: PropTypes.object,
  status: PropTypes.string,
};

export default connect(mapStateToProps)(IntroductionPage);
