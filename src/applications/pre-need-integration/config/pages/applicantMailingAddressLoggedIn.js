import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  getReturnState,
  clearReturnState,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { scrollTo } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui/focus';
import ApplicantMailingAddressCard from '../../components/ApplicantMailingAddressCard';

const ApplicantMailingAddressLoggedIn = ({
  data,
  onReviewPage,
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

  const handleEdit = field => {
    if (field === 'address') {
      // Set the custom field to trigger the edit flow
      const updatedFormData = {
        ...data,
        'view:loggedInEditAddress': true,
      };
      dispatch(setData(updatedFormData));
      goForward({ formData: updatedFormData });
    }
  };

  if (onReviewPage) {
    const { address } = data?.application?.claimant || {};
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
      <div>
        <div className="review-row">
          <dt>Mailing address</dt>
          <dd>{formatAddress(address)}</dd>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showSuccessAlert('address', 'mailing address')}
      <ApplicantMailingAddressCard
        formData={data}
        onEdit={handleEdit}
        content="We'll send any important information about your application to this address."
      />
      {contentBeforeButtons}
      <NavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </div>
  );
};

export default ApplicantMailingAddressLoggedIn;
