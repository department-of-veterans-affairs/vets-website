import { parseISO } from 'date-fns';
import format from 'date-fns/format';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearFormData, removeAskVaForm } from '../actions';

const PersonalAuthenticatedInformation = ({
  goForward,
  formData,
  isLoggedIn,
  router,
  formId,
}) => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!isLoggedIn) {
        goForward(formData);
      }
    },
    [isLoggedIn, formData, goForward],
  );

  const handleGoBack = () => {
    dispatch(clearFormData());
    dispatch(removeAskVaForm(formId));
    router.push('/');
  };

  const { first, last, dateOfBirth, socialOrServiceNum } =
    formData.aboutYourself || {};

  const { ssn, serviceNumber } = socialOrServiceNum || {};

  const nameDisplay = first || last ? `${first} ${last}` : 'No name provided';
  const dateOfBirthFormatted = !dateOfBirth
    ? 'None provided'
    : format(parseISO(dateOfBirth.split('T')[0]), 'MMMM d, yyyy');

  let ssnOrServiceNumDisplay = '';
  if (ssn) {
    ssnOrServiceNumDisplay = `Social Security number: ●●●–●●–${ssn.substr(
      ssn.length - 4,
    )}`;
  } else if (serviceNumber) {
    ssnOrServiceNumDisplay = `Service number: ${serviceNumber}`;
  } else {
    ssnOrServiceNumDisplay = 'Social Security number: None provided';
  }

  useEffect(
    () => {
      focusElement('h2');
    },
    [formData.aboutYourself],
  );

  return (
    <>
      <div>
        <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
          <h2 className="vads-u-font-size--h3">Your personal information</h2>
          <p>This is the personal information we have on file for you.</p>
          <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-margin-top--4 vads-u-margin-bottom--4">
            <div className="vads-u-padding-left--1">
              <p className="vads-u-margin--1px vads-u-font-weight--bold dd-privacy-mask">
                {nameDisplay}
              </p>
              <p
                className="vads-u-margin--1px dd-privacy-mask"
                data-dd-action-name="Veteran's SSN"
              >
                {ssnOrServiceNumDisplay}
              </p>
              <p className="vads-u-margin--1px dd-privacy-mask">
                Date of birth: {dateOfBirthFormatted}
              </p>
            </div>
          </div>
          <p>
            <span className="vads-u-font-weight--bold">Note:</span> If you need
            to update your personal information, call us at{' '}
            <va-telephone contact="8008271000" />. We’re here Monday through
            Friday, 8:00 a.m. to 9:00 p.m. ET.
          </p>
        </div>
        <FormNavButtons goBack={handleGoBack} goForward={goForward} />
      </div>
    </>
  );
};

PersonalAuthenticatedInformation.propTypes = {
  formData: PropTypes.object,
  formId: PropTypes.string,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  router: PropTypes.object,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    user: state.user.profile,
    formData: state.form.data,
    formId: state.form.formId,
  };
};

export default connect(mapStateToProps)(
  withRouter(PersonalAuthenticatedInformation),
);
