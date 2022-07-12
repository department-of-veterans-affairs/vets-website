import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';

import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';

export const Form0995App = ({
  loggedIn,
  location,
  children,
  profile,
  formData,
  setFormData,
}) => {
  const { email = {}, mobilePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};

  useEffect(
    () => {
      if (loggedIn) {
        const { veteran = {} } = formData || {};
        if (
          email?.emailAddress !== veteran.email ||
          mobilePhone?.updatedAt !== veteran.phone?.updatedAt ||
          mailingAddress?.updatedAt !== veteran.address?.updatedAt
        ) {
          setFormData({
            ...formData,
            veteran: {
              ...veteran,
              address: mailingAddress,
              phone: mobilePhone,
              email: email?.emailAddress,
            },
          });
        }
      }
    },
    [loggedIn, email, mobilePhone, mailingAddress, formData, setFormData],
  );

  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
  return (
    <article id="form-0995" data-location={`${location?.pathname?.slice(1)}`}>
      {content}
    </article>
  );
};

Form0995App.propTypes = {
  getContestableIssues: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  children: PropTypes.any,
  contestableIssues: PropTypes.shape({}),
  formData: PropTypes.shape({
    additionalIssues: PropTypes.array,
    areaOfDisagreement: PropTypes.array,
    benefitType: PropTypes.string,
    contestedIssues: PropTypes.array,
    legacyCount: PropTypes.number,
    informalConferenceRep: PropTypes.shape({}),
  }),
  legacyCount: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  profile: PropTypes.shape({
    vapContactInfo: PropTypes.shape({}),
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  savedForms: PropTypes.array,
};

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
  formData: state.form?.data || {},
  profile: selectProfile(state) || {},
  savedForms: state.user?.profile?.savedForms || [],
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form0995App);
