import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <>
        <p>
          You can apply for VA Aid and Attendance or Housebound benefits online,
          by mail, or in person.
        </p>
        <p>
          <span>
            <strong>If you’re in a nursing home,</strong>
          </span>{' '}
          you’ll also need to fill out a Request for Nursing Home Information in
          Connection with Claim for Aid and Attendance (VA Form 21-0779).
        </p>
        <a href="/forms/21-0779/">Get VA Form 21-0779 to download</a>

        <h3>Online</h3>
        <p>
          You can apply for Aid and Attendance benefits or Housebound allowance
          online now. A medical examiner must fill out the examination
          information section.
        </p>
        <a
          className="vads-c-action-link--blue"
          href="/pension/aid-attendance-housebound/apply-form-21-2680"
        >
          Apply for Aid and Attendance benefits or Housebound allowance
        </a>
      </>
    );
  }

  return (
    <>
      <p>
        You can apply for VA Aid and Attendance or Housebound benefits by mail,
        or in person.
      </p>
      <p>
        <span>
          <strong>If you’re in a nursing home,</strong>
        </span>{' '}
        you’ll also need to fill out a Request for Nursing Home Information in
        Connection with Claim for Aid and Attendance (VA Form 21-0779).
      </p>
      <a href="/forms/21-0779/">Get VA Form 21-0779 to download</a>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form2680Enabled],
});

export default connect(mapStateToProps)(App);
