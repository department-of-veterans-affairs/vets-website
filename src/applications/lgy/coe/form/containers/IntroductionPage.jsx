import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { notLoggedInContent } from './introduction-content/notLoggedInContent.jsx';
import COEIntroPageBox from './introduction-content/COEIntroPageBox';
import LoggedInContent from './introduction-content/loggedInContent.jsx';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../shared/constants';

const IntroductionPage = props => {
  let content;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });
  // Set the content to be the loading indicator
  content = <va-loading-indicator message="Loading your application..." />;

  // Once the coe call is done, render the rest of the content
  const coeCallEnded = [CALLSTATUS.failed, CALLSTATUS.success, CALLSTATUS.skip];

  if (!props.loggedIn && coeCallEnded.includes(props.status)) {
    content = notLoggedInContent(props);
  }
  if (props.loggedIn && coeCallEnded.includes(props.status)) {
    content = (
      <div>
        <FormTitle title="Request a VA home loan Certificate of Eligibility (COE)" />
        <p className="vads-u-padding-bottom--3">
          Request for a Certificate of Eligibility (VA Form 26-1880)
        </p>
        <COEIntroPageBox
          coe={props.coe}
          status={props.status}
          downloadURL={props.downloadURL}
        />
        {props.coe.status !== COE_ELIGIBILITY_STATUS.denied && (
          <LoggedInContent parentProps={props} />
        )}
      </div>
    );
  }

  return <div>{content}</div>;
};

const mapStateToProps = state => ({
  status: state.certificateOfEligibility.generateAutoCoeStatus,
  coe: state.certificateOfEligibility.coe,
  downloadURL: state.certificateOfEligibility.downloadURL,
  loggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(IntroductionPage);
