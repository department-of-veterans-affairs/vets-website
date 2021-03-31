import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';
import { noticeOfDisagreementFeature } from '../helpers';
import { showWorkInProgress } from '../content/WorkInProgressMessage';

export const FormApp = ({
  location,
  children,
  profile,
  formData,
  setFormData,
  showNod,
}) => {
  const { email = {}, homePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};

  // Update profile data changes in the form data dynamically
  useEffect(
    () => {
      const { veteran = {} } = formData || {};
      if (
        email?.emailAddress !== veteran.email ||
        homePhone?.updatedAt !== veteran.phone?.updatedAt ||
        mailingAddress?.updatedAt !== veteran.address?.updatedAt
      ) {
        setFormData({
          ...formData,
          veteran: {
            ...veteran,
            address: mailingAddress,
            phone: homePhone,
            email: email?.emailAddress,
          },
        });
      }
    },
    [email, homePhone, mailingAddress, formData, setFormData],
  );

  return (
    <article id="form-10182" data-location={`${location?.pathname?.slice(1)}`}>
      {showNod ? (
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          {children}
        </RoutedSavableApp>
      ) : (
        showWorkInProgress(formConfig)
      )}
    </article>
  );
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const formData = state.form?.data || {};
  const showNod = noticeOfDisagreementFeature(state);
  return { profile, formData, showNod };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormApp);
