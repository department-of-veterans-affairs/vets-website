import React, { useEffect } from 'react';
import {
  getReturnState,
  clearReturnState,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { scrollTo } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui/focus';
import { formatPhone } from '../utils/helpers';
import ApplicantContactInfoCard from '../components/ApplicantContactInfoCard';

const ApplicantContactInfoLoggedIn = ({
  data,
  onReviewPage,
  goToPath,
  goBack,
  goForward,
  NavButtons,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const editState = getReturnState();

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
    const isUpdated = returnState === 'updated';
    const isFormOnly = returnState === 'form-only';
    const isVisible = lastEdited === id && (isUpdated || isFormOnly);

    if (!isVisible) return null;

    return (
      <va-alert
        id={`updated-${id}`}
        visible
        class="vads-u-margin-y--1"
        status="success"
      >
        <h2 slot="headline">We've updated your {text}</h2>
        <p className="vads-u-margin-y--0">
          {isUpdated
            ? `We’ve made these changes to this form and your VA.gov profile.`
            : `We’ve made these changes to only this form.`}
        </p>
      </va-alert>
    );
  };

  const handleEdit = field => {
    if (field === 'phone') {
      goToPath('/applicant-contact-info-logged-in/edit-phone', {
        force: true,
      });
    } else if (field === 'email') {
      goToPath('/applicant-contact-info-logged-in/edit-email', {
        force: true,
      });
    }
  };

  if (onReviewPage) {
    const { email, phoneNumber } = data || {};

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

export default ApplicantContactInfoLoggedIn;
