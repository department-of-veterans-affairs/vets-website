import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import EvidenceSummary from '../../components/EvidenceSummary';
import { content } from '../../content/evidenceSummary';
import {
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  EVIDENCE_OTHER,
  EVIDENCE_VA_PATH,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_UPLOAD_PATH,
  LIMITED_CONSENT_PROMPT_PATH,
} from '../../constants';

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
  goBack = () => {},
  goForward = () => {},
  setFormData = () => {},
  onReviewPage = false,
  updatePage = () => {},
  list = records(),
} = {}) =>
  render(
    <div>
      <EvidenceSummary
        data={{
          [EVIDENCE_VA]: vaMR,
          [EVIDENCE_PRIVATE]: privateMR,
          [EVIDENCE_OTHER]: other,

          ...list,
          limitedConsent: limit,
        }}
        goBack={goBack}
        goForward={goForward}
        setFormData={setFormData}
        contentBeforeButtons="testing"
        contentAfterButtons="after"
        onReviewPage={onReviewPage}
        updatePage={updatePage}
        testing
      />
    </div>,
  );

describe('<EvidenceSummary>', () => {
  it('should render', () => {
    const { container } = setupSummary({ limit: 'Pizza addiction' });

    expect($$('h3', container).length).to.eq(1);
    expect($$('h4', container).length).to.eq(4);
    expect($$('ul', container).length).to.eq(3);
    expect($$('.form-nav-buttons button', container).length).to.eq(2);
  });

  it('should render with no data', () => {
    const { container } = setupSummary({ list: {} });

    expect($$('h3', container).length).to.eq(2); // includes no evidence alert
    expect($$('ul', container).length).to.eq(0);
    expect($$('.form-nav-buttons button', container).length).to.eq(2);
  });

  it('should render error messages with partial data', async () => {
    const goForward = sinon.spy();
    const { container } = setupSummary({
      list: {
        locations: [{}],
        providerFacility: [{}],
        additionalDocuments: [{}],
      },
      goForward,
    });

    expect($$('h3', container).length).to.eq(1);
    expect($$('h4', container).length).to.eq(4);
    expect($$('ul', container).length).to.eq(3);
    expect($$('.usa-input-error-message', container).length).to.eq(9);
    expect($$('.form-nav-buttons button', container).length).to.eq(2);

    await fireEvent.click(
      $('.form-progress-buttons .usa-button-primary', container),
    );

    waitFor(() => {
      expect(goForward.called).to.be.false;
    });
  });

  it('should render only one section', () => {
    const { container } = setupSummary({
      privateMR: false,
      other: false,
    });

    expect($('va-alert[visible="true"]', container)).to.not.exist;
    expect($$('h3', container).length).to.eq(1);
    expect($$('ul', container).length).to.eq(1);
  });

  it('should render missing evidence alert', () => {
    const { container } = setupSummary({
      vaMR: false,
      privateMR: false,
      other: false,
    });

    expect($('va-alert[status="warning"][visible="true"]', container)).to.exist;
    expect($$('va-alert h3', container).length).to.eq(1);
    expect($$('ul', container).length).to.eq(0);
  });

  it('should include the correct edit URL links', () => {
    const { container } = setupSummary();

    const links = $$('.edit-item', container);

    expect(links.length).to.eq(7);
    expect(links[0].getAttribute('data-link')).to.contain(
      `${EVIDENCE_VA_PATH}?index=0`,
    );
    expect(links[1].getAttribute('data-link')).to.contain(
      `${EVIDENCE_VA_PATH}?index=1`,
    );
    expect(links[2].getAttribute('data-link')).to.contain(
      LIMITED_CONSENT_PROMPT_PATH,
    );
    expect(links[3].getAttribute('data-link')).to.contain(
      `${EVIDENCE_PRIVATE_PATH}?index=0`,
    );
    expect(links[4].getAttribute('data-link')).to.contain(
      `${EVIDENCE_PRIVATE_PATH}?index=1`,
    );
    expect(links[5].getAttribute('data-link')).to.contain(EVIDENCE_UPLOAD_PATH);
    expect(links[6].getAttribute('data-link')).to.contain(EVIDENCE_UPLOAD_PATH);
  });

  it('should submit page without error', async () => {
    const goForward = sinon.spy();
    const { container } = setupSummary({ goForward });

    await fireEvent.click(
      $('.form-progress-buttons .usa-button-primary', container),
    );
    expect(goForward.called).to.be.true;
  });

  it('should not navigate forward with errors', async () => {
    const goForward = sinon.spy();
    const list = records();
    list.locations[0].issues = [];
    const { container } = setupSummary({
      limit: 'Pizza addiction',
      list,
      goForward,
    });

    await fireEvent.click(
      $('.form-progress-buttons .usa-button-primary', container),
    );

    waitFor(() => {
      expect(goForward.called).to.be.false;
    });
  });

  it('should not update on review & submit with errors', async () => {
    const updateSpy = sinon.spy();
    const list = records();
    list.locations[0].issues = [];
    const { container } = setupSummary({
      limit: 'Pizza addiction',
      list,
      onReviewPage: true,
      updatePage: updateSpy,
    });

    await fireEvent.click($('.form-nav-buttons va-button', container));

    waitFor(() => {
      expect(updateSpy.called).to.be.false;
    });
  });

  it('should navigate forward with not-included partial data', () => {
    const goForward = sinon.spy();
    const { container } = setupSummary({
      vaMR: false,
      privateMR: false,
      other: false,
      limit: 'Pizza addiction',
      list: {
        locations: [{}],
        providerFacility: [{}],
        additionalDocuments: [{}],
      },
      goForward,
    });

    fireEvent.click($('.form-progress-buttons .usa-button-primary', container));
    expect(goForward.called).to.be.true;
  });

  it('should call goBack to get to the private limitation page, even with errors', async () => {
    const goBack = sinon.spy();
    const { container } = setupSummary({
      vaMR: false,
      privateMR: false,
      other: false,
      limit: 'Pizza addiction',
      goBack,
    });

    await fireEvent.click(
      $('.form-progress-buttons .usa-button-secondary', container),
    );
    expect(goBack.called).to.be.true;
  });

  // Remove entries
  it('should remove second VA entry when remove is clicked', async () => {
    const setFormData = sinon.spy();
    const { container } = setupSummary({ setFormData });
    const result = records().locations[0];

    // remove second VA entry
    await fireEvent.click(
      $('va-button[label="Remove VAMC Location 2"]', container),
    );

    const modal = await $('va-modal', container);
    await modal.__events.primaryButtonClick(); // Remove entry

    await waitFor(() => {
      expect(setFormData.called).to.be.true;
      expect(setFormData.args[0][0].locations[0]).to.deep.equal(result);
    });
  });

  it('should not remove VA entry when "No" is selected in the modal', async () => {
    const setFormData = sinon.spy();
    const { container } = setupSummary({ setFormData });

    // remove second VA entry
    await fireEvent.click(
      $('va-button[label="Remove VAMC Location 2"]', container),
    );

    const secondaryButton = $('va-button[secondary]', container);
    fireEvent.click(secondaryButton);

    await waitFor(() => {
      expect(setFormData.called).to.be.false;
    });
  });

  it('should remove second private entry when remove is clicked', async () => {
    const setFormData = sinon.spy();
    const { container } = setupSummary({ setFormData });
    const result = records().providerFacility[0];

    // remove second private entry
    await fireEvent.click(
      $('va-button[label="Remove Private Hospital"]', container),
    );

    const modal = await $('va-modal', container);
    await modal.__events.primaryButtonClick(); // Remove entry

    await waitFor(() => {
      expect(setFormData.called).to.be.true;
      expect(setFormData.args[0][0].providerFacility[0]).to.deep.equal(result);
    });
  });

  it('should not remove private entry when "No" is selected in the modal', async () => {
    const setFormData = sinon.spy();
    const { container } = setupSummary({ setFormData });

    // remove second VA entry
    await fireEvent.click(
      $('va-button[label="Remove Private Hospital"]', container),
    );

    const secondaryButton = $('va-button[secondary]', container);
    fireEvent.click(secondaryButton);

    await waitFor(() => {
      expect(setFormData.called).to.be.false;
    });
  });

  it('should remove second upload entry when remove is clicked', async () => {
    const setFormData = sinon.spy();
    const { container } = setupSummary({ setFormData });
    const result = records().additionalDocuments[0];

    // remove second upload entry
    await fireEvent.click($('va-button[label="Delete x-rays.pdf"]', container));

    const modal = await $('va-modal', container);
    await modal.__events.primaryButtonClick(); // Remove entry

    await waitFor(() => {
      expect(setFormData.called).to.be.true;
      expect(setFormData.args[0][0].additionalDocuments[0]).to.deep.equal(
        result,
      );
    });
  });

  it('should not remove upload when "No" is selected in the modal', async () => {
    const setFormData = sinon.spy();
    const { container } = setupSummary({ setFormData });

    // remove second VA entry
    await fireEvent.click($('va-button[label="Delete x-rays.pdf"]', container));

    const secondaryButton = $('va-button[secondary]', container);
    fireEvent.click(secondaryButton);

    await waitFor(() => {
      expect(setFormData.called).to.be.false;
    });
  });

  it('should render on review & submit in edit mode', () => {
    const { container } = setupSummary({ onReviewPage: true });

    expect($$('h4', container).length).to.eq(2);
    // now includes limited consent
    expect(
      $$('.private-facility, .private-limitation', container).length,
    ).to.eq(2);
    expect($$('.form-nav-buttons button', container).length).to.eq(0);
    expect(
      $('.form-nav-buttons va-button', container).getAttribute('text'),
    ).to.eq(content.update);
  });
  it('should call updatePage on review & submit in edit mode', async () => {
    const updateSpy = sinon.spy();
    const { container } = setupSummary({
      onReviewPage: true,
      updatePage: updateSpy,
    });

    await fireEvent.click($('.form-nav-buttons va-button', container));
    expect(updateSpy.called).to.be.true;
  });
});
