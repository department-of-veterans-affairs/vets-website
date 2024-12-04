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
      treatmentDate: '2002-05',
    },
    {
      locationAndName: 'VAMC Location 2',
      issues: ['Test 2'],
      evidenceDates: { from: '2002-02-02', to: '2012-02-02' },
      treatmentDate: '2002-07',
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
  showScNewForm = false,
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
          showScNewForm,

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
    expect(
      $$('.va-title, .private-title, .upload-title', container).length,
    ).to.eq(3);
    expect($$('ul', container).length).to.eq(3);

    const items = $$('li', container);
    expect(items.length).to.eq(7);
    expect(items[0].textContent).to.contain(
      'VAMC Location 1TestJan 1, 2001 – Jan 1, 2011',
    );
    expect(items[1].textContent).to.contain(
      'VAMC Location 2Test 2Feb 2, 2002 – Feb 2, 2012',
    );
    expect(items[2].textContent).to.contain(
      'Private DoctorPTSD and TinnitusApr 1, 2022 – Jul 1, 2022',
    );
    expect(items[3].textContent).to.contain(
      'Private HospitalTest 2, Tinnitus, and TestSep 20, 2022 – Sep 30, 2022',
    );
    expect(items[4].textContent).to.contain(
      'Yes, I want to limit the information requested',
    );
    expect(items[5].textContent).to.contain(
      'private-medical-records.pdfMedical Treatment Record - Non-Government Facility',
    );
    expect(items[6].textContent).to.contain('x-rays.pdfOther Correspondence');

    expect($$('a', container).length).to.eq(0);
    expect($('a.vads-c-action-link--green', container)).to.not.exist;
  });

  it('should render VA evidence one section', () => {
    const { container } = setupSummary({
      privateMR: false,
      other: false,
      limit: 'Pizza addiction',
    });

    expect($$('h4', container).length).to.eq(1);
    expect($$('ul', container).length).to.eq(1);
    expect($$('li', container).length).to.eq(2);
    expect($('a.vads-c-action-link--green', container)).to.not.exist;
  });

  it('should only render VA evidence section with new data', () => {
    const { container } = setupSummary({
      privateMR: false,
      other: false,
      limit: 'Pizza addiction',
      showScNewForm: true,
    });

    expect($$('h4', container).length).to.eq(1);
    expect($$('ul', container).length).to.eq(1);

    const items = $$('li', container);
    expect(items.length).to.eq(2);
    expect(items[0].textContent).to.contain('VAMC Location 1TestMay 2002');
    expect(items[1].textContent).to.contain('VAMC Location 2Test 2July 2002');
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
