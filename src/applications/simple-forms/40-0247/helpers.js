import React from 'react';

import moment from 'moment';

import recordEvent from 'platform/monitoring/record-event';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  getScrollOptions,
  focusElement,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';

export function trackNoAuthStartLinkClick() {
  recordEvent({ event: 'no-login-start-form' });
}

export function getInitialData({ mockData, environment }) {
  return !!mockData && environment.isLocalhost() && !window.Cypress
    ? mockData
    : undefined;
}

export const pageFocusScroll = () => {
  const focusSelector =
    'va-segmented-progress-bar[uswds][heading-text][header-level="2"]';
  const scrollToName = 'v3SegmentedProgressBar';
  return () => {
    waitForRenderThenFocus(focusSelector);
    setTimeout(() => {
      scrollTo(scrollToName, getScrollOptions({ offset: 0 }));
    }, 100);
  };
};

export const supportingDocsDescription = (
  <div className="supp-docs-description">
    <p>We prefer that you upload the Veteran’s or Reservist’s DD214.</p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, .jpg, or .png file</li>
      <li>Your file should be no larger than 20MB</li>
    </ul>
  </div>
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
