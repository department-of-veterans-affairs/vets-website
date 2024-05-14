import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import EvidenceSummaryReview from '../../components/EvidenceSummaryReview';
import {
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  EVIDENCE_OTHER,
  SUMMARY_EDIT,
} from '../../constants';
import { content } from '../../content/evidenceSummary';

const providerFacilityAddress = {
  country: 'USA',
  street: '123 main',
  city: 'city',
  state: 'AK',
  postalCode: '90210',
};

const records = () => ({
  locations: [
    {
      locationAndName: 'VAMC Location 1',
      issues: ['Test'],
      evidenceDates: { from: '2001-01-01', to: '2011-01-01' },
    },
    {
      locationAndName: 'VAMC Location 2',
      issues: ['Test 2'],
      evidenceDates: { from: '2002-02-02', to: '2012-02-02' },
    },
  ],
  providerFacility: [
    {
      providerFacilityName: 'Private Doctor',
      providerFacilityAddress,
      issues: ['PTSD', 'Tinnitus'],
      treatmentDateRange: { from: '2022-04-01', to: '2022-07-01' },
    },
    {
      providerFacilityName: 'Private Hospital',
      providerFacilityAddress,
      issues: ['Test 2', 'Tinnitus', 'Test'],
      treatmentDateRange: { from: '2022-09-20', to: '2022-09-30' },
    },
  ],
  additionalDocuments: [
    {
      name: 'private-medical-records.pdf',
      confirmationCode: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      attachmentId: 'L049',
      size: 20000,
      isEncrypted: false,
    },
    {
      name: 'x-rays.pdf',
      confirmationCode: 'ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj',
      attachmentId: 'L023',
      size: 30000,
      isEncrypted: false,
    },
  ],
});

const setupSummary = ({
  vaMR = true,
  privateMR = true,
  other = true,
  limit,
  list = records(),
  editPage = () => {},
} = {}) =>
  render(
    <div>
      <EvidenceSummaryReview
        data={{
          [EVIDENCE_VA]: vaMR,
          [EVIDENCE_PRIVATE]: privateMR,
          [EVIDENCE_OTHER]: other,

          ...list,
          limitedConsent: limit,
        }}
        editPage={editPage}
      />
    </div>,
  );

describe('<EvidenceSummaryReview>', () => {
  it('should render', () => {
    const { container } = setupSummary({ limit: 'Pizza addiction' });

    expect($('va-button', container)).to.exist;
    // now includes limited consent
    expect($$('h5', container).length).to.eq(3);
    expect($$('ul', container).length).to.eq(3);
    expect($$('a', container).length).to.eq(0);
    expect($('a.vads-c-action-link--green', container)).to.not.exist;
  });

  it('should render only one section', () => {
    const { container } = setupSummary({
      privateMR: false,
      other: false,
      limit: 'Pizza addiction',
    });

    expect($$('h4', container).length).to.eq(1);
    expect($$('ul', container).length).to.eq(1);
    expect($('a.vads-c-action-link--green', container)).to.not.exist;
  });

  it('should render missing evidence alert', () => {
    const { container } = setupSummary({
      vaMR: false,
      privateMR: false,
      other: false,
      limit: 'Pizza addiction',
    });

    expect($$('h3', container).length).to.eq(0);
    expect($$('ul', container).length).to.eq(0);
    expect($$('a', container).length).to.eq(0);
    expect($('a.vads-c-action-link--green', container)).to.not.exist;
    expect(container.innerHTML).to.contain(content.missingEvidenceReviewText);
  });

  it('should call editPage callback', () => {
    const editPageSpy = sinon.spy();
    const { container } = setupSummary({ editPage: editPageSpy });

    fireEvent.click($('va-button', container));

    expect(editPageSpy.called).to.be.true;
  });

  it('should focus on edit button after updating page', async () => {
    global.window.sessionStorage.setItem(SUMMARY_EDIT, 'true');
    setupSummary({ list: {}, limit: undefined });

    await waitFor(() => {
      expect(global.window.sessionStorage.getItem(SUMMARY_EDIT)).to.be.null;
    });
  });
});
