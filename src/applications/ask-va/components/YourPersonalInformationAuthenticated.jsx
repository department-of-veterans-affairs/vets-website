import format from 'date-fns/format';
import { setData } from 'platform/forms-system/src/js/actions';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
// import prefillTransformer from '../config/prefill-transformer';

const PersonalAuthenticatedInformation = ({
  goBack,
  goForward,
  // setFormData,
  formData,
  isLoggedIn,
}) => {
  // const prefillData = prefillTransformer();
  if (!isLoggedIn) {
    goForward(formData);
  }

  const {
    first,
    last,
    dateOfBirth,
    socialOrServiceNum,
  } = formData.aboutYourself;

  const { ssn, serviceNumber } = socialOrServiceNum;

  const dateOfBirthFormatted = !dateOfBirth
    ? '-'
    : format(new Date(dateOfBirth), 'MMMM d, yyyy');

  let ssnLastFour = '-';
  if (ssn) {
    ssnLastFour = ssn.substr(ssn.length - 4);
  }

  useEffect(() => {
    focusElement('h2');
    // if (!formData.aboutYourself.first) {
    //   setFormData({
    //     ...prefillData.formData,
    //   });
    // }
  }, []);

  return (
    <>
      <div>
        <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
          <h2 className="vads-u-font-size--h3">Your personal information</h2>
          <p>This is the personal information we have on file for you.</p>
          <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-margin-top--4 vads-u-margin-bottom--4">
            <div className="vads-u-padding-left--1">
              <p className="vads-u-margin--1px vads-u-font-weight--bold dd-privacy-mask">
                {first} {last}
              </p>
              <p
                className="vads-u-margin--1px dd-privacy-mask"
                data-dd-action-name="Veteran's SSN"
              >
                {ssn
                  ? `Social Security number: ●●●–●●–${ssnLastFour}`
                  : `Service number: ${serviceNumber}`}
              </p>
              <p className="vads-u-margin--1px dd-privacy-mask">
                Date of birth: {dateOfBirthFormatted}
              </p>
            </div>
          </div>
          <p>
            <span className="vads-u-font-weight--bold">Note:</span> If you need
            to update your personal information, please call us at{' '}
            <va-telephone contact="8008271000" />. We’re here Monday through
            Friday, 8:00 a.m. to 9:00 p.m. ET.
          </p>
        </div>
        <FormNavButtons goBack={goBack} goForward={goForward} />
      </div>
    </>
  );
};

PersonalAuthenticatedInformation.propTypes = {
  formData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    user: state.user.profile,
    formData: state.form.data,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonalAuthenticatedInformation);
