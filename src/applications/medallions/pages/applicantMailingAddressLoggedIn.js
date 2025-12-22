import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  getReturnState,
  clearReturnState,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { scrollTo } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui/focus';
import ApplicantMailingAddressCard from '../components/ApplicantMailingAddressCard';

const ApplicantMailingAddressLoggedIn = ({
  data,
  onReviewPage,
  goBack,
  goForward,
  goToPath,
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
        if (returnState === 'updated' || returnState === 'form-only') {
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

    if (lastEdited === id && returnState === 'updated') {
      return (
        <va-alert
          id={`updated-${id}`}
          visible
          class="vads-u-margin-y--2"
          status="success"
        >
          <h2 slot="headline">We’ve updated your {text}</h2>
          <p className="vads-u-margin-y--0">
            We’ve made these changes to this form and your VA.gov profile.
          </p>
        </va-alert>
      );
    }

    if (lastEdited === id && returnState === 'form-only') {
      return (
        <va-alert
          id={`updated-${id}`}
          visible
          class="vads-u-margin-y--2"
          status="success"
        >
          <h2 slot="headline">We’ve updated your {text}</h2>
          <p className="vads-u-margin-y--0">
            We’ve made these changes to only this form.
          </p>
        </va-alert>
      );
    }

    return null;
  };

  const handleEdit = field => {
    if (field === 'address') {
      // Set the custom field to trigger the edit flow
      const updatedFormData = {
        ...data,
        'view:loggedInEditAddress': true,
      };
      dispatch(setData(updatedFormData));

      // If on review page, store the return path
      if (onReviewPage) {
        sessionStorage.setItem('addressEditReturnPath', '/review-and-submit');
      }

      // Use goToPath to navigate to edit page
      // The force: true option ensures navigation even from review page
      if (goToPath) {
        goToPath('/applicant-mailing-address-logged-in/edit-address', {
          force: true,
        });
      } else if (goForward) {
        goForward({ formData: updatedFormData });
      }
    }
  };

  if (onReviewPage) {
    const { address } = data || {};
    const formatAddress = addr => {
      if (!addr) return 'Not provided';

      const parts = [
        addr.street,
        addr.street2,
        addr.city,
        addr.state ? `${addr.state} ${addr.postalCode || ''}` : addr.postalCode,
        addr.country,
      ].filter(Boolean);

      return parts.join(', ');
    };

    return (
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Mailing address
          </h4>
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>Mailing address</dt>
            <dd>{formatAddress(address)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div>
      <h3>Confirm the mailing address we have on file for you</h3>
      {showSuccessAlert('address', 'mailing address')}
      <div className="vads-u-margin-bottom--2">
        <p className="vads-u-margin--0">
          We may mail information about your application to the address you
          provide here.
        </p>
      </div>
      <ApplicantMailingAddressCard formData={data} onEdit={handleEdit} />
      {contentBeforeButtons}
      {NavButtons && <NavButtons goBack={goBack} goForward={goForward} />}
      {contentAfterButtons}
    </div>
  );
};

export default ApplicantMailingAddressLoggedIn;
