// custom form-help component
// adds & displays some state-mapped props to facilitate testing in Staging
import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';

export function CustomGetFormHelp(props) {
  const { userIdVerified, userLoggedIn } = props;

  return (
    <>
      <p className="help-talk">
        <strong>If you have trouble using this online request,</strong> call us
        at <va-telephone contact="8006982411" /> (
        <va-telephone contact="711" tty />
        ). We&rsquo;re here 24/7.
      </p>
      <p className="help-talk">
        <strong>
          If you need help gathering your information or filling out this
          request,
        </strong>{' '}
        contact a local Veterans Service Organization (VSO).
      </p>
      <va-link
        href="https://va.gov/vso/"
        text="Find a local Veterans Service Organization"
      />
      {!environment.isProduction() && (
        <div className="vads-u-margin-top--2 vads-u-color--gray-light">
          [userLoggedIn: {userLoggedIn ? 'true' : 'false'}; userIdVerified:{' '}
          {userIdVerified ? 'true' : 'false'}]
        </div>
      )}
    </>
  );
}

CustomGetFormHelp.propTypes = {
  userIdVerified: PropTypes.bool.isRequired,
  userLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(CustomGetFormHelp);
