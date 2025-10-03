import { expect } from 'chai';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  EVIDENCE_PRIVATE_DETAILS_PATH,
  EVIDENCE_VA_DETAILS_PATH,
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
      `/${EVIDENCE_VA_DETAILS_PATH}?index=${providerIndex}`,
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
      `/${EVIDENCE_PRIVATE_DETAILS_PATH}?index=${providerIndex}`,
    );
  }
};

/* <h5 class="va-title vads-u-font-weight--bold">We’re requesting records from these VA locations:</h5>
<ul class="evidence-summary remove-bullets" role="list">
<li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2 vads-u-margin-bottom--2">
<div class="">
<h6 class="va-location dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold" data-dd-action-name="VA location name">South Texas VA Facility</h6>
<div class="dd-privacy-hidden overflow-wrap-word" data-dd-action-name="VA location treated issues">Hypertension</div>
<div class="dd-privacy-hidden" data-dd-action-name="VA location treatment date">February 2000</div>
<div class="vads-u-margin-top--1p5">
<va-link disable-analytics="true" id="edit-va-0" aria-label="Edit South Texas VA Facility" data-link="/supporting-evidence/va-medical-records?index=0" text="Edit" href="/supporting-evidence/va-medical-records?index=0" label="Edit South Texas VA Facility" class="edit-item">
</va-link>
<va-button data-index="0" data-type="va" class="remove-item vads-u-width--auto vads-u-margin-left--2 vads-u-margin-top--0" label="Remove South Texas VA Facility" text="Remove" secondary="true">
</va-button>
</div>
</div>
</li>
<li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2 vads-u-margin-bottom--2">
<div class="">
<h6 class="va-location dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold" data-dd-action-name="VA location name">Midwest Alabama VA Facility</h6>
<div class="dd-privacy-hidden overflow-wrap-word" data-dd-action-name="VA location treated issues">Hypertension and Gluten Intolerance</div>I don’t have the date<div class="vads-u-margin-top--1p5">
<va-link disable-analytics="true" id="edit-va-1" aria-label="Edit Midwest Alabama VA Facility" data-link="/supporting-evidence/va-medical-records?index=1" text="Edit" href="/supporting-evidence/va-medical-records?index=1" label="Edit Midwest Alabama VA Facility" class="edit-item">
</va-link>
<va-button data-index="1" data-type="va" class="remove-item vads-u-width--auto vads-u-margin-left--2 vads-u-margin-top--0" label="Remove Midwest Alabama VA Facility" text="Remove" secondary="true">
</va-button>
</div>
</div>
</li>
</ul> */
