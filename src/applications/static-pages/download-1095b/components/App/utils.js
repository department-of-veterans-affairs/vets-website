import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const errorTypes = Object.freeze({
  NOT_FOUND: 'not found',
  DOWNLOAD_ERROR: 'download error',
  SYSTEM_ERROR: 'system error',
});

export const phoneComponent = number => {
  return (
    <>
      <va-telephone contact={number} /> (
      <va-telephone contact={CONTACTS['711']} tty />)
    </>
  );
};

export const notFoundComponent = (
  <va-alert close-btn-aria-label="Close notification" status="info" visible>
    <h4 slot="headline">
      You don’t have a 1095-B tax form available right now
    </h4>
    <p className="vads-u-margin-y--0">
      You do not have a 1095-B tax form available. This could be because you
      weren’t enrolled in VA healthcare in 2024. If you think you were enrolled,
      call us at {phoneComponent(CONTACTS['222_VETS'])}. We’re here Monday
      through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </va-alert>
);

export const unavailableComponent = (
  <va-alert close-btn-aria-label="Close notification" status="info" visible>
    <h2 slot="headline">
      Your 1095-B form isn’t available to download right now
    </h2>
    <div>
      <p>
        Check back later. Or, if you need help with this form now, call us at{' '}
        {phoneComponent(CONTACTS['222_VETS'])}. We’re here Monday through
        Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </div>
  </va-alert>
);

export const downloadErrorComponent = (
  <div id="downloadError" className="vads-u-margin-bottom--2p5">
    <va-alert close-btn-aria-label="Close notification" status="error" visible>
      <p className="vads-u-margin-y--0">
        We’re sorry. Something went wrong when we tried to download your form.
        Please try again. If your form still doesn’t download, call us at{' '}
        {phoneComponent(CONTACTS['222_VETS'])}. We’re here 24/7.
      </p>
    </va-alert>
  </div>
);

export const systemErrorComponent = (
  <va-alert close-btn-aria-label="Close notification" status="error" visible>
    <h3 slot="headline">System error</h3>
    <p className="vads-u-margin-y--0">
      We’re sorry, something went wrong on our end. Try to view your 1095-B
      later. If the issue persists, call us at{' '}
      {phoneComponent(CONTACTS['222_VETS'])}. We’re here 24/7.
    </p>
  </va-alert>
);
