import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getNextPagePath } from 'platform/forms-system/src/js/routing';

import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

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
        // goToPath('/veteran-information/profile-information');
        goToPath(getNextPagePath);
      }
    },
    [isLoggedIn, goToPath],
  );

  const navButtons = <FormNavButtons goBack={goBack} goForward={goForward} />;

  let dateOfBirthFormatted = '-';
  let ssnLastFour = '-';
  if (veteranSocialSecurityNumber) {
    ssnLastFour = veteranSocialSecurityNumber.substr(
      veteranSocialSecurityNumber.length - 4,
    );
  }
  if (veteranDateOfBirth) {
    dateOfBirthFormatted = moment(veteranDateOfBirth).format('MMMM DD, YYYY');
  }

  return (
    <>
      {isLoggedIn && (
        <div>
          <div className="hca-id-form-wrapper vads-u-margin-bottom--2">
            <p>This is the personal information we have on file for you.</p>
            <div className="vads-u-border-left--7px vads-u-border-color--primary">
              <div className="vads-u-padding-left--1">
                <p className="vads-u-margin--1px">
                  <strong>
                    {' '}
                    {first} {middle} {last} {suffix}
                  </strong>
                </p>
                <p className="vads-u-margin--1px">
                  Last 4 of Social Security number: {ssnLastFour}
                </p>
                <p className="vads-u-margin--1px">
                  Date of birth: {dateOfBirthFormatted}
                </p>
              </div>
            </div>
            <p>
              <strong>Note: </strong>
              If you need to update your personal information, call our VA
              benefits hotline at
              <Telephone
                contact={CONTACTS.VA_BENEFITS}
                className="vads-u-margin-x--0p5"
              />
              (TTY:
              <Telephone
                contact={CONTACTS[711]}
                pattern={PATTERNS['3_DIGIT']}
                className="vads-u-margin-left--0p5"
              />
              ), Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
            </p>
          </div>
          {navButtons}
        </div>
      )}
    </>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    user: state.user.profile,
    data: state.form.data,
  };
};

export default connect(mapStateToProps)(PersonalAuthenticatedInformation);
