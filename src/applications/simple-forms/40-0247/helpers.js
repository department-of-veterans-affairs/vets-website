import React from 'react';

import moment from 'moment';

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
    <p className="hideOnReviewPage">
      To be eligible for a Presidential Memorial Certificate, the deceased
      Veteran or Reservist must meet eligibility requirements for burial in a VA
      national cemetery.
    </p>
    <p className="hideOnReviewPage">
      Not sure if the Veteran or Reservist is eligible?
    </p>
    <p className="hideOnReviewPage">
      <a href="/burials-memorials/eligibility/">
        Check eligibility requirements for burial in a VA national cemetary
        (opens in new tab)
      </a>
    </p>
    <p className="vads-u-margin-bottom--4 hideOnReviewPage">
      We prefer that you upload the Veteran’s or Reservist’s DD214.
    </p>
  </>
);

export const createPayload = (file, formId, password) => {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  if (password) {
    payload.append('password', password);
  }
  return payload;
};

export function parseResponse({ data }) {
  const { name } = data.attributes;
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
    confirmationCode: data.attributes.confirmationCode,
  };
}

export function dateOfDeathValidation(errors, fields) {
  const { veteranDateOfBirth, veteranDateOfDeath } = fields;
  const dob = moment(veteranDateOfBirth);
  const dod = moment(veteranDateOfDeath);

  if (dod.isBefore(dob)) {
    errors.veteranDateOfDeath.addError(
      'Provide a date that is after the date of birth',
    );
  }
}
