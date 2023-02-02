import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import {
  EVIDENCE_VA_PATH,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_LIMITATION_PATH,
  EVIDENCE_UPLOAD_PATH,
} from '../../constants';

import { content } from '../../content/evidenceSummary';
import {
  VaContent,
  PrivateContent,
  UploadContent,
} from '../../components/EvidenceSummaryLists';

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

describe('evidenceSummaryList', () => {
  describe('buildVaContent', () => {
    it('should render editable VA content', () => {
      const vaEvidence = records().locations;
      const { container } = render(<VaContent list={vaEvidence} testing />);

      expect($('h3', container).textContent).to.contain(content.vaTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(2);
      expect($$('.remove-item', container).length).to.eq(2);
    });
    it('should render review-only VA content', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <VaContent list={vaEvidence} reviewMode testing />,
      );

      expect($('h5', container).textContent).to.contain(content.vaTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });
    it('should have edit links pointing to the appropriate VA indexed page', () => {
      const vaEvidence = records().locations;
      const { container } = render(<VaContent list={vaEvidence} testing />);

      const links = $$('.edit-item', container);
      expect(links[0].getAttribute('data-link')).to.contain(
        `${EVIDENCE_VA_PATH}?index=0`,
      );
      expect(links[1].getAttribute('data-link')).to.contain(
        `${EVIDENCE_VA_PATH}?index=1`,
      );
    });
    it('should execute callback when removing an entry', () => {
      const removeSpy = sinon.spy();
      const vaEvidence = records().locations;
      const handlers = { removeVaLocation: removeSpy };
      const { container } = render(
        <VaContent list={vaEvidence} handlers={handlers} testing />,
      );

      const buttons = $$('.remove-item', container);
      fireEvent.click(buttons[0]);
      expect(removeSpy.calledOnce).to.be.true;
      expect(removeSpy.args[0][0].target.getAttribute('data-index')).to.eq('0');
      fireEvent.click(buttons[1]);
      expect(removeSpy.calledTwice).to.be.true;
      expect(removeSpy.args[1][0].target.getAttribute('data-index')).to.eq('1');
    });
  });

  describe('buildPrivateContent', () => {
    it('should render editable private content', () => {
      const privateEvidence = records().providerFacility;
      const { container } = render(
        <PrivateContent list={privateEvidence} limitedConsent="test" testing />,
      );

      expect($('h3', container).textContent).to.contain(content.privateTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(3);
      expect($$('.edit-item', container).length).to.eq(3);
      expect($$('.remove-item', container).length).to.eq(3);
    });
    it('should not render limited consent section remove button', () => {
      const privateEvidence = records().providerFacility;
      const { container } = render(
        <PrivateContent list={privateEvidence} limitedConsent="" testing />,
      );

      expect($$('.edit-item', container).length).to.eq(3);
      expect($$('.remove-item', container).length).to.eq(2);
    });
    it('should render review-only private content', () => {
      const privateEvidence = records().providerFacility;
      const { container } = render(
        <PrivateContent
          list={privateEvidence}
          limitedConsent="test"
          reviewMode
          testing
        />,
      );

      expect($('h5', container).textContent).to.contain(content.privateTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(3);
      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });
    it('should have edit links pointing to the appropriate private indexed page or limitation page', () => {
      const privateEvidence = records().providerFacility;
      const { container } = render(
        <PrivateContent list={privateEvidence} testing />,
      );

      const links = $$('.edit-item', container);
      expect(links[0].getAttribute('data-link')).to.contain(
        `${EVIDENCE_PRIVATE_PATH}?index=0`,
      );
      expect(links[1].getAttribute('data-link')).to.contain(
        `${EVIDENCE_PRIVATE_PATH}?index=1`,
      );
      expect(links[2].getAttribute('data-link')).to.contain(
        EVIDENCE_LIMITATION_PATH,
      );
    });
    it('should execute callback when removing an entry', () => {
      const removeSpy = sinon.spy();
      const privateEvidence = records().providerFacility;
      const handlers = { removePrivateFacility: removeSpy };
      const { container } = render(
        <PrivateContent list={privateEvidence} handlers={handlers} testing />,
      );

      const buttons = $$('.remove-item', container);
      fireEvent.click(buttons[0]);
      expect(removeSpy.calledOnce).to.be.true;
      expect(removeSpy.args[0][0].target.getAttribute('data-index')).to.eq('0');
      fireEvent.click(buttons[1]);
      expect(removeSpy.calledTwice).to.be.true;
      expect(removeSpy.args[1][0].target.getAttribute('data-index')).to.eq('1');
    });
    it('should execute callback when removing the limitation', () => {
      const removeSpy = sinon.spy();
      const privateEvidence = records().providerFacility;
      const handlers = { removePrivateLimitation: removeSpy };
      const { container } = render(
        <PrivateContent
          list={privateEvidence}
          limitedConsent="test"
          handlers={handlers}
          testing
        />,
      );

      const buttons = $$('.remove-item', container);
      fireEvent.click(buttons[2]);
      expect(removeSpy.called).to.be.true;
    });
  });

  describe('buildUploadContent', () => {
    it('should render editable uploaded content', () => {
      const otherEvidence = records().additionalDocuments;
      const { container } = render(
        <UploadContent list={otherEvidence} testing />,
      );

      expect($('h3', container).textContent).to.contain(content.otherTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(2);
      expect($$('.remove-item', container).length).to.eq(2);
    });
    it('should render review-only uploaded content', () => {
      const otherEvidence = records().additionalDocuments;
      const { container } = render(
        <UploadContent list={otherEvidence} reviewMode testing />,
      );

      expect($('h5', container).textContent).to.contain(content.otherTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });
    it('should have edit links pointing to the upload page', () => {
      const otherEvidence = records().additionalDocuments;
      const { container } = render(
        <UploadContent list={otherEvidence} testing />,
      );

      const links = $$('.edit-item', container);
      expect(links[0].getAttribute('data-link')).to.contain(
        EVIDENCE_UPLOAD_PATH,
      );
      expect(links[1].getAttribute('data-link')).to.contain(
        EVIDENCE_UPLOAD_PATH,
      );
    });
    it('should execute callback when removing an upload', () => {
      const removeSpy = sinon.spy();
      const otherEvidence = records().additionalDocuments;
      const handlers = { removeUpload: removeSpy };
      const { container } = render(
        <UploadContent list={otherEvidence} handlers={handlers} testing />,
      );

      const buttons = $$('.remove-item', container);
      fireEvent.click(buttons[0]);
      expect(removeSpy.calledOnce).to.be.true;
      expect(removeSpy.args[0][0].target.getAttribute('data-index')).to.eq('0');
      fireEvent.click(buttons[1]);
      expect(removeSpy.calledTwice).to.be.true;
      expect(removeSpy.args[1][0].target.getAttribute('data-index')).to.eq('1');
    });
  });
});
