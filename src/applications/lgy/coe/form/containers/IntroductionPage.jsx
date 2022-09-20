import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import COEIntroPageBox from '../content/COEIntroPageBox';
import LoggedInContent from '../content/LoggedInContent';
import NotLoggedInContent from '../content/NotLoggedInContent';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../shared/constants';
import { RenderError } from '../../shared/components/errors/RenderError';

const IntroductionPage = ({ coe, errors, loggedIn, route, status }) => {
  let content;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });
  // Set the content to be the loading indicator
  content = <va-loading-indicator message="Loading your application..." />;

  // Once the coe call is done, render the rest of the content
  const coeCallEnded = [CALLSTATUS.success, CALLSTATUS.skip];

  if (!loggedIn && coeCallEnded.includes(status)) {
    content = <NotLoggedInContent route={route} />;
  }

  if (loggedIn && coeCallEnded.includes(status)) {
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

  if (loggedIn && !coeCallEnded.includes(status)) {
    content = (
      <>
        <RenderError error={errors.coe[0].code} introPage />
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
  errors: state.certificateOfEligibility.errors,
  loggedIn: isLoggedIn(state),
  status: state.certificateOfEligibility.generateAutoCoeStatus,
});

IntroductionPage.propTypes = {
  coe: PropTypes.object,
  errors: PropTypes.object,
  loggedIn: PropTypes.bool,
  route: PropTypes.object,
  status: PropTypes.string,
};

export default connect(mapStateToProps)(IntroductionPage);
