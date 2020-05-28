import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export default function SingleSignOnInfoModal({
  dismiss,
  isLoggedIn,
  useSSOe,
  useSSOeEbenefitsLinks,
}) {
  if (!isLoggedIn || !useSSOe) return null;

  return (
    <Modal visible onClose={dismiss} id="modal-announcment">
      <h1 className="vads-u-font-size--h3 vads-u-margin-top--2">
        Sign in once to access the VA sites you use most
      </h1>
      <p>
        {`Now when you sign into VA.gov, we’ll also sign you into MyHealtheVet${
          useSSOeEbenefitsLinks ? ', eBenefits,' : ''
        } and
        other VA sites.`}
      </p>
      <p>
        <strong>With a single sign on, you can:</strong>
      </p>
      <ul>
        <li>
          {`Track and manage your VA ${
            useSSOeEbenefitsLinks ? 'benefits and ' : ''
          }services with just one username
          and password`}
        </li>
        <li>
          Access the VA sites you use most without having to sign in each time
        </li>
        <li>Sign out of VA.gov and be signed out of other VA sites</li>
      </ul>
      <button type="button" onClick={dismiss}>
        Continue to VA.gov
      </button>
    </Modal>
  );
}
