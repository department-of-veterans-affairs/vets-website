import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import { FIELD_NAMES } from '@@vap-svc/constants';
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

const ContactInfo = ({ formData, vapAddress, goToPath }) => {
  const dispatch = useDispatch();
  const handlers = {
    onSubmit: event => {
      // This prevents this nested form submit event from passing to the
      // outer form and causing a page advance
      event.stopPropagation();

      const address = {
        city: vapAddress.value?.city,
        state: vapAddress.value?.stateCode,
        country: vapAddress.value?.countryCodeIso3,
        postalCode: vapAddress.value?.zipCode,
        street: vapAddress.value?.addressLine1,
        street2: vapAddress.value?.addressLine2,
      };

      const updatedFormData = set(
        'application.applicant[view:applicantInfo].mailingAddress',
        address,
        { ...formData }, // make a copy of the original formData
      );
      dispatch(setData(updatedFormData));
    },
    cancel: () => {
      goToPath('/supporting-documents');
    },
    success: () => {
      goToPath('/preparer');
    },
  };

  return (
    <div
      className="va-profile-wrapper"
      onSubmit={handlers.onSubmit}
      id={`edit-${FIELD_NAMES.MAILING_ADDRESS}`}
    >
      <InitializeVAPServiceID>
        <h3>Hello Mate</h3>
        <ProfileInformationFieldController
          forceEditView
          isDeleteDisabled
          fieldName={FIELD_NAMES.MAILING_ADDRESS}
          showEditView={false}
          showValidationView={false}
          cancelCallback={handlers.cancel}
          successCallback={handlers.success}
          saveButtonText="Continue"
          cancelButtonText="Back"
        />
      </InitializeVAPServiceID>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    formData: state.form?.data,
    vapAddress: state.vapService?.formFields?.mailingAddress,
  };
};

export default connect(mapStateToProps)(ContactInfo);
