import React from 'react';
import { Toggler } from 'platform/utilities/feature-toggles';

export default function NoAddressBanner() {
  return (
    <>
      <va-alert status="warning" class="vads-u-margin-bottom--4">
        <h3 slot="headline">We don’t have a valid address on file for you</h3>
        <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.lettersPageNewDesign}>
          {toggleValue =>
            toggleValue ? (
              <div>
                You’ll need to{' '}
                <a href="/records/download-va-letters/letters/edit-address">
                  update your address
                </a>{' '}
                before you can view and download your VA letters or documents.
              </div>
            ) : (
              <div>
                You’ll need to{' '}
                <a href="/profile/contact-information">update your address</a>{' '}
                before you can view and download your VA letters or documents.
              </div>
            )
          }
        </Toggler.Hoc>
      </va-alert>
      <p />
    </>
  );
}
