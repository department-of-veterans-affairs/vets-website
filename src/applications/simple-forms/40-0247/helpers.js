import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

export function getInitialData({ mockData, environment }) {
  return !!mockData && environment.isLocalhost() && !window.Cypress
    ? mockData
    : undefined;
}

export const supportingDocsDescription = (
  <>
    <p>
      We don’t require that you submit anything with this form. But to speed up
      the process, we encourage you to submit military records or discharge
      documents if they’re available.
    </p>
    <p>
      To be eligible for a Presidential Memorial Certificate, the deceased
      Veteran or Reservist must meet eligibility requirements for burial in a VA
      national cemetery.
    </p>
    <p>Not sure if the Veteran or Reservist is eligible?</p>
    <p>
      <a href="/burials-memorials/eligibility/">
        Check eligibility requirements for burial in a VA national cemetary
        (opens in new tab)
      </a>
    </p>
    <p className="vads-u-margin-bottom--4">
      We prefer that you upload the Veteran’s or Reservist’s DD214.
    </p>
  </>
);

export const createPayload = (file, _formId, password) => {
  const payload = new FormData();
  payload.append('files_attachment[file_data]', file);
  if (password) {
    payload.append('files_attachment[password]', password);
  }
  return payload;
};

export function parseResponse({ data }, { name }) {
  const focusFileCard = () => {
    const target = $$('.schemaform-file-list li').find(entry =>
      entry.textContent?.trim().includes(name),
    );

    if (target) {
      focusElement(target);
    }
  };

  setTimeout(() => {
    focusFileCard();
  }, 100);

  return {
    name,
    confirmationCode: data.attributes.guid,
  };
}
