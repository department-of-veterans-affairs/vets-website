import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  getReturnState,
  clearReturnState,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { scrollTo } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui/focus';
import ApplicantContactInfoCard from '../components/ApplicantContactInfoCard';

const ApplicantContactDetailsLoggedIn = ({
  data,
  onReviewPage,
  goToPath,
  goBack,
  goForward,
  NavButtons,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();
  const editState = getReturnState();

  // Clear the edit flag when returning to this page
  useEffect(() => {
    if (data?.['view:loggedInEditAddress'] === true) {
      const updatedFormData = {
        ...data,
        'view:loggedInEditAddress': false,
      };
      dispatch(setData(updatedFormData));
    }

    // Clear return path if we've returned to this page
    if (!onReviewPage) {
      sessionStorage.removeItem('addressEditReturnPath');
    }
  }, []);

  useEffect(
    () => {
      if (editState) {
        const [lastEdited, returnState] = editState.split(',');
        if (returnState === 'updated') {
          setTimeout(() => {
            const target = `#updated-${lastEdited}`;
            scrollTo('topContentElement');
            focusElement(target);
          }, 100);
        }
        // Clear the return state after showing the alert
        clearReturnState();
      }
    },
    [editState],
  );

  const showSuccessAlert = (id, text) => {
    if (!editState) return null;
    const [lastEdited, returnState] = editState.split(',');
    return (
      <va-alert
        id={`updated-${id}`}
        visible={lastEdited === id && returnState === 'updated'}
        class="vads-u-margin-y--1"
        status="success"
      >
        <h2 slot="headline">We’ve updated your {text}</h2>
        <p className="vads-u-margin-y--0">
          We’ve made these changes to this form and your VA.gov profile.
        </p>
      </va-alert>
    );
  };

  const handleEdit = () => {
    // Set a flag in form data to indicate that the user is editing
    const updatedFormData = {
      ...data,
      'view:loggedInEditContactInfo': true,
    };
    dispatch(setData(updatedFormData));

    // Always navigate to the organization contact info page for editing.
    // This will open the applicantContactInfo2 page where the user can edit
    // contact details (email and phone) in one place.
    goToPath('/applicant-contact-info', { force: true });
  };

  if (onReviewPage) {
    const { email, phoneNumber } = data?.application?.claimant || {};
    const formatPhone = phone => {
      if (!phone) return 'Not provided';

      // Remove all non-digit characters
      const digitsOnly = phone.replace(/\D/g, '');

      // Format as xxx-xxx-xxxx if we have exactly 10 digits
      if (digitsOnly.length === 10) {
        return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(
          3,
          6,
        )}-${digitsOnly.slice(6)}`;
      }

      // If not 10 digits, return as-is (fallback)
      return phone;
    };

    return (
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Contact details
          </h4>
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>Phone number</dt>
            <dd>{formatPhone(phoneNumber)}</dd>
          </div>
          <div className="review-row">
            <dt>Email address</dt>
            <dd>{email || 'Not provided'}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div>
      {showSuccessAlert('phone', 'phone number')}
      {showSuccessAlert('email', 'email address')}
      <ApplicantContactInfoCard
        formData={data}
        onEdit={handleEdit}
        content="We may contact you at the email address or phone number you provide here."
      />
      {contentBeforeButtons}
      {NavButtons && <NavButtons goBack={goBack} goForward={goForward} />}
      {contentAfterButtons}
    </div>
  );
};

export default ApplicantContactDetailsLoggedIn;
