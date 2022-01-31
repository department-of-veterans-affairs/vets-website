import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const PersonalAuthenticatedInformation = ({
  goBack,
  goForward,
  goToPath,
  isLoggedIn,
  data: {
    veteranFullName: { first, middle, last, suffix },
    veteranDateOfBirth,
    veteranSocialSecurityNumber,
  },
}) => {
  useEffect(
    () => {
      if (!isLoggedIn) {
        goToPath('/veteran-information/personal-information-unauthenticated');
      }
    },
    [isLoggedIn, goToPath],
  );
  const navButtons = <FormNavButtons goBack={goBack} goForward={goForward} />;
  if (isLoggedIn) {
    const ssnLastFour = veteranSocialSecurityNumber
      ? veteranSocialSecurityNumber.substr(
          veteranSocialSecurityNumber.length - 4,
        )
      : null;

    let dob;
    if (veteranDateOfBirth) {
      dob = new Date(veteranDateOfBirth);
      const dobMonth = monthNames[new Date(veteranDateOfBirth).getMonth()];
      const dobDay = dob.getDay();
      const dobYear = dob.getFullYear();
      dob = `${dobMonth} ${dobDay}, ${dobYear}`;
    } else {
      dob = null;
    }

    return (
      <div>
        <div className="hca-id-form-wrapper">
          <p>This is the personal information we have on file for you.</p>
          <div className="vads-u-margin-y--2p5">
            <va-alert
              close-btn-aria-label="Close notification"
              status="info"
              visible
            >
              <dl className="vads-u-margin--0">
                <dt className="vads-u-line-height--2 vads-u-padding-bottom--2 vads-u-font-size--base">
                  <strong>
                    {first} {middle} {last} {suffix}
                  </strong>
                </dt>
                <dd className="vads-u-line-height--2 vads-u-padding-bottom--2 vads-u-font-size--base">
                  Last 4 of Social Security number: {ssnLastFour}
                </dd>
                <dd className="vads-u-line-height--2 vads-u-font-size--base">
                  Date of birth: {dob}
                </dd>
              </dl>
            </va-alert>
          </div>
        </div>
        {navButtons}
      </div>
    );
  } else {
    return <React.Fragment />;
  }
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    user: state.user.profile,
    data: state.form.data,
  };
};

export default connect(mapStateToProps)(PersonalAuthenticatedInformation);
