import React, { useEffect } from 'react';
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
      goToPath('applicant-mailing-address-logged-in/edit-address', {
        force: true,
      });
    }
  };

  if (onReviewPage) {
    const { address } = data?.application?.claimant || {};

    const formatAddress = addr => {
      if (!addr) return 'Not provided';

      const { street, street2, city, state, postalCode, country } = addr;

      if (!street) return 'Not provided';

      let formattedAddress = street;
      if (street2) formattedAddress += `, ${street2}`;
      if (city || state || postalCode) {
        formattedAddress += `, ${city || ''}${
          city && (state || postalCode) ? ', ' : ''
        }${state || ''}${state && postalCode ? ' ' : ''}${postalCode || ''}`;
      }
      if (country && country !== 'United States') {
        formattedAddress += `, ${country}`;
      }

      return formattedAddress;
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
        content="We may mail information about your application to the address you provide here."
      />
      {contentBeforeButtons}
      <NavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </div>
  );
};

export default ApplicantMailingAddressLoggedIn;
