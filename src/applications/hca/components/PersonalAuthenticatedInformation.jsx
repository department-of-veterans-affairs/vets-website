import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

import { fetchTotalDisabilityRating } from '../actions';

const PersonalAuthenticatedInformation = ({
  goBack,
  goForward,
  setFormData,
  isLoggedIn,
  formData,
  getTotalDisabilityRating,
  totalDisabilityRating,
}) => {
  useEffect(
    () => {
      getTotalDisabilityRating();
    },
    [getTotalDisabilityRating],
  );

  useEffect(
    () => {
      setFormData({
        ...formData,
        'view:totalDisabilityRating': totalDisabilityRating || 0,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [totalDisabilityRating],
  );

  const navButtons = <FormNavButtons goBack={goBack} goForward={goForward} />;

  const {
    veteranFullName: { first, middle, last, suffix },
    veteranDateOfBirth,
    veteranSocialSecurityNumber,
  } = formData;

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
            <div className="vads-u-border-left--7px vads-u-border-color--primary vads-u-padding-y--1 vads-u-margin-bottom--3">
              <div className="vads-u-padding-left--1">
                <p className="vads-u-margin--1px">
                  <strong>
                    {' '}
                    {first || ''} {middle || ''} {last || ''} {suffix || ''}
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
              benefits hotline at{' '}
              <va-telephone contact={CONTACTS.VA_BENEFITS} />
              (TTY: <va-telephone contact={CONTACTS[711]} />
              ), Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
            </p>
            <p>
              You can also call your VA medical center (
              <a href="/find-locations">find a VA location tool</a>) to get help
              changing your name on file with VA. Ask for the eligibility
              department.
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
    formData: state.form.data,
    isLoggedIn: state.user.login.currentlyLoggedIn,
    user: state.user.profile,
    loading: state.totalRating.loading,
    error: state.totalRating.error,
    totalDisabilityRating: state.totalRating.totalDisabilityRating,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
  getTotalDisabilityRating: fetchTotalDisabilityRating,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonalAuthenticatedInformation);

PersonalAuthenticatedInformation.propTypes = {
  error: PropTypes.object,
  first: PropTypes.string,
  formData: PropTypes.object,
  getTotalDisabilityRating: PropTypes.func,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  last: PropTypes.string,
  loading: PropTypes.bool,
  middle: PropTypes.string,
  setFormData: PropTypes.func,
  suffix: PropTypes.string,
  totalDisabilityRating: PropTypes.number,
  veteranDateOfBirth: PropTypes.string,
  veteranSocialSecurityNumber: PropTypes.string,
};
