import { expect } from 'chai';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  EVIDENCE_PRIVATE_DETAILS_URL,
  EVIDENCE_VA_DETAILS_URL,
} from '../constants';

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
