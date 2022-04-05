import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { RenderError } from '../../shared/components/errors/RenderError';
import { notLoggedInContent } from './introduction-content/notLoggedInContent';
import COEIntroPageBox from './introduction-content/COEIntroPageBox';
import LoggedInContent from './introduction-content/loggedInContent';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../shared/constants';

const IntroductionPage = ({
  coe,
  downloadUrl,
  loggedIn,
  route,
  status,
  errors,
  isLoading,
}) => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });
  // Set the content to be the loading indicator
  let content = <va-loading-indicator message="Loading your application..." />;
  let header = null;

  // Once the coe call is done, render the rest of the content
  const coeCallEnded = [CALLSTATUS.success, CALLSTATUS.skip];

  if (!loggedIn && !isLoading) {
    content = notLoggedInContent(route);
  }

  if (loggedIn) {
    if (coeCallEnded.includes(status)) {
      header = (
        <COEIntroPageBox
          downloadUrl={downloadUrl}
          referenceNumber={coe.referenceNumber}
          requestDate={coe.applicationCreateDate}
          status={coe.status}
        />
      );
    } else {
      header = <RenderError error={errors.coe[0].code} introPage />;
    }

    content = (
      <>
        {header}
        {coe.status !== COE_ELIGIBILITY_STATUS.denied && (
          <LoggedInContent route={route} status={coe.status} />
        )}
      </>
    );
  }

  return (
    <>
      <FormTitle title="Request a VA home loan Certificate of Eligibility (COE)" />
      <p className="vads-u-padding-bottom--3">
        Request for a Certificate of Eligibility (VA Form 26-1880)
      </p>
      {content}
    </>
  );
};

const mapStateToProps = state => ({
  coe: state.certificateOfEligibility.coe,
  errors: state.certificateOfEligibility.errors,
  downloadUrl: state.certificateOfEligibility.downloadUrl,
  loggedIn: isLoggedIn(state),
  status: state.certificateOfEligibility.generateAutoCoeStatus,
  isLoading: state.certificateOfEligibility.isLoading,
});

IntroductionPage.propTypes = {
  coe: PropTypes.object,
  downloadUrl: PropTypes.string,
  errors: PropTypes.object,
  isLoading: PropTypes.bool,
  loggedIn: PropTypes.bool,
  route: PropTypes.object,
  status: PropTypes.string,
};

export default connect(mapStateToProps)(IntroductionPage);
