import { expect } from 'chai';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { fireEvent } from '@testing-library/react';
import {
  EVIDENCE_PRIVATE_DETAILS_URL,
  EVIDENCE_VA_DETAILS_URL,
} from '../constants';

/**
 * Use the following code once va-button-pair replaces current buttons, unless
 * the back link is moved to the top of the page when minimal headers/footers
 * are implemented
 */
/*
const clickEvent = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

const clickContinue = container => {
  const pair = $('va-button-pair', container);
  pair.__events.primaryClick(clickEvent);
};

const clickBack = container => {
  const pair = $('va-button-pair', container);
  pair.__events.secondaryClick(clickEvent);
};
*/

export const clickContinue = container => {
  fireEvent.click($('va-button[continue]', container));
};

export const clickBack = container => {
  fireEvent.click($('va-button[back]', container));
};

export const clickAddAnother = container => {
  const link = container.querySelector('va-link-action');
  fireEvent.click(link);
};

export const verifyHeader = (headers, index, expectedContent) => {
  expect(headers[index].textContent).to.eq(expectedContent);
};

export const verifyResponse = (listItems, index, expectedContent) => {
  expect(listItems[index].textContent).to.contain(expectedContent);
};

export const verifyLink = (selector, expectedPath) => {
  const link = $$(selector)?.[0];

  // Lint is a bit confused here because this isn't a .unit.spec.jsx file
  // eslint-disable-next-line no-unused-expressions
  expect(link).to.exist;
  expect(link.href).to.eq(expectedPath);
};

export const verifyProvider = (headers, listItems, listIndex, data) => {
  verifyHeader(headers, listIndex, data.providerName);
  verifyResponse(listItems, listIndex, data.issues);
  verifyResponse(listItems, listIndex, data.dates);

  if (data.address) {
    data.address.forEach(chunk => {
      verifyResponse(listItems, listIndex, chunk);
    });
  }
};

export const verifyProviderVA = (
  headers,
  listItems,
  data,
  listIndex,
  providerIndex,
  reviewMode,
) => {
  verifyProvider(headers, listItems, listIndex, data);

  if (!reviewMode) {
    verifyLink(
      `#edit-va-${providerIndex}`,
      `/${EVIDENCE_VA_DETAILS_URL}?index=${providerIndex}`,
    );

    const removeButton = $$(`va-button[data-index="${providerIndex}"]`)[0];

    // Lint is a bit confused here because this isn't a .unit.spec.jsx file
    // eslint-disable-next-line no-unused-expressions
    expect(removeButton).to.exist;
  }
};

export const verifyProviderPrivate = (
  headers,
  listItems,
  data,
  listIndex,
  providerIndex,
  reviewMode,
) => {
  verifyProvider(headers, listItems, listIndex, data);

  if (!reviewMode) {
    verifyLink(
      `#edit-private-${providerIndex}`,
      `/${EVIDENCE_PRIVATE_DETAILS_URL}?index=${providerIndex}`,
    );
  }
};
