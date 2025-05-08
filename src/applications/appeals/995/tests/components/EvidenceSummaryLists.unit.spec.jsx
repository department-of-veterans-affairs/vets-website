import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  EVIDENCE_VA_PATH,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_LIMITATION_PATH,
  EVIDENCE_UPLOAD_PATH,
  LIMITATION_KEY,
} from '../../constants';

import { content } from '../../content/evidenceSummary';
import { content as vaContent } from '../../content/evidenceVaRecords';
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

const records = ({ emptyIssue = false } = {}) => ({
  locations: [
    {
      locationAndName: 'VAMC Location 1',
      issues: emptyIssue ? [] : ['Test 1'],
      treatmentDate: '2011-01',
      noDate: false,
    },
    {
      locationAndName: 'VAMC Location 2',
      issues: ['Test 1', 'Test 2'],
      treatmentDate: '',
      noDate: true,
    },
  ],
  providerFacility: [
    {
      providerFacilityName: 'Private Doctor',
      providerFacilityAddress,
      issues: emptyIssue ? [] : ['Test 1', 'Test 2'],
      treatmentDateRange: { from: '2022-04-01', to: '2022-07-01' },
    },
    {
      providerFacilityName: 'Private Hospital',
      providerFacilityAddress,
      issues: ['Test 1', 'Test 2', 'Tinnitus'],
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
      const { container } = render(
        <VaContent list={vaEvidence} showScNewForm testing />,
      );

      expect($('.va-title', container).textContent).to.contain(content.vaTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(2);
      expect($$('.va-location', container).length).to.eq(2);
      expect($$('.remove-item', container).length).to.eq(2);
      // check Datadog classes
      expect(
        $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
      ).to.eq(5); // 3 x 2 entries (-1 for "I don't have a date")
    });

    it('should render nothing when no data is passed in', () => {
      const { container } = render(
        <div>
          <VaContent testing />
        </div>,
      );

      expect(container.innerHTML).to.eq('<div></div>');
    });

    it('should render review-only VA content', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <VaContent list={vaEvidence} showScNewForm reviewMode testing />,
      );

      expect($('.va-title', container).textContent).to.contain(content.vaTitle);
      expect($$('ul[role="list"]', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.va-location', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });

    it('should render list only for confirmation page content', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <VaContent
          list={vaEvidence}
          showScNewForm
          reviewMode
          showListOnly
          testing
        />,
      );

      expect($('.va-title', container).textContent).to.contain(content.vaTitle);
      expect($$('ul[role="list"]', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.va-location', container).length).to.eq(2);

      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });

    it('should show missing issues message', () => {
      const vaEvidence = records({ emptyIssue: true }).locations;
      const { container } = render(
        <VaContent list={vaEvidence} showScNewForm testing />,
      );

      const li = $$('li', container);
      expect(li[0].textContent).to.contain('Missing condition');
      expect(li[1].textContent).to.contain('Test 1 and Test 2');
    });
    it('should show missing location name & treatment dates', () => {
      const vaEvidence = [
        {
          locationAndName: '',
          issues: [],
          treatmentDate: '',
          noDate: false,
        },
      ];
      const { container } = render(
        <VaContent list={vaEvidence} showScNewForm testing />,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing location name');
      expect(li.textContent).to.contain('Missing treatment date');
    });
    it('should show missing location message with partial list', () => {
      const { container } = render(
        <div>
          <VaContent list={['']} showScNewForm testing />
        </div>,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing location name');
    });
    it('should show missing treatment date', () => {
      const vaEvidence = [{ treatmentDate: '' }];
      const { container } = render(
        <VaContent list={vaEvidence} showScNewForm testing />,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing treatment date');
    });

    it('should not show missing treatment date when no date checkbox is selected', () => {
      const vaEvidence = [{ treatmentDate: '', noDate: true }];
      const { container } = render(
        <VaContent list={vaEvidence} showScNewForm testing />,
      );

      const li = $('li', container);
      expect(li.textContent).to.not.contain('Missing treatment date');
      expect(li.textContent).to.contain(vaContent.noDate);
    });

    it('should have edit links pointing to the appropriate VA indexed page', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <VaContent list={vaEvidence} showScNewForm testing />,
      );

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
      const handlers = { showModal: removeSpy };
      const { container } = render(
        <VaContent
          list={vaEvidence}
          handlers={handlers}
          showScNewForm
          testing
        />,
      );

      const buttons = $$('.remove-item', container);
      fireEvent.click(buttons[0]);
      expect(removeSpy.calledOnce).to.be.true;
      expect(removeSpy.args[0][0].target.getAttribute('data-index')).to.eq('0');
      expect(removeSpy.args[0][0].target.getAttribute('data-type')).to.eq('va');
      fireEvent.click(buttons[1]);
      expect(removeSpy.calledTwice).to.be.true;
      expect(removeSpy.args[1][0].target.getAttribute('data-index')).to.eq('1');
      expect(removeSpy.args[1][0].target.getAttribute('data-type')).to.eq('va');
    });
  });

  describe('buildPrivateContent', () => {
    it('should render editable private content', () => {
      const privateEvidence = records().providerFacility;
      const { container } = render(
        <PrivateContent
          list={privateEvidence}
          limitedConsent="test"
          privacyAgreementAccepted
          showScNewForm
          showLimitedConsentYN
          testing
        />,
      );
      expect($('.private-title', container).textContent).to.contain(
        content.privateTitle,
      );
      expect($$('ul[role="list"]', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(5);
      expect($$('.private-facility', container).length).to.eq(2);
      expect($$('.private-limitation', container).length).to.eq(1);
      expect($$('.edit-item', container).length).to.eq(5);
      expect($$('.remove-item', container).length).to.eq(2);
      // check Datadog classes
      expect(
        $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
      ).to.eq(6); // 3 x 2 entries
    });

    it('should render nothing when no data is passed in', () => {
      const { container } = render(
        <div>
          <PrivateContent testing />
        </div>,
      );

      expect(container.innerHTML).to.eq('<div></div>');
    });

    it('should not render limited consent section remove button', () => {
      const privateEvidence = records().providerFacility;
      const { container } = render(
        <PrivateContent list={privateEvidence} limitedConsent="" testing />,
      );
      expect($$('.private-facility', container).length).to.eq(2);
      expect($$('.private-limitation', container).length).to.eq(1);
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

      expect($('.private-title', container).textContent).to.contain(
        content.privateTitle,
      );
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(3);
      expect($$('.private-facility', container).length).to.eq(2);
      expect($$('.private-limitation', container).length).to.eq(1);
      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });
    it('should render list only for confirmation page content', () => {
      const privateEvidence = records().providerFacility;
      const { container } = render(
        <PrivateContent
          list={privateEvidence}
          limitedConsent="test"
          reviewMode
          showListOnly
          testing
        />,
      );

      expect($('.private-title', container).textContent).to.contain(
        content.privateTitle,
      );
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(3);
      expect($$('.private-facility', container).length).to.eq(2);
      expect($$('.private-limitation', container).length).to.eq(1);
      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });
    it('should show missing facility message', () => {
      const { container } = render(
        <PrivateContent list={['']} limitedConsent="" testing />,
      );

      const ul = $('ul', container);
      expect(ul.textContent).to.contain('Missing provider name');
      expect(ul.textContent).to.contain('Missing condition');
      expect(ul.textContent).to.contain('Incomplete address');
      expect(ul.textContent).to.contain('Missing treatment dates');
    });
    it('should show missing issues message', () => {
      const privateEvidence = records({ emptyIssue: true }).providerFacility;
      const { container } = render(
        <PrivateContent list={privateEvidence} limitedConsent="" testing />,
      );

      const li = $$('li', container);
      expect(li[0].textContent).to.contain('Missing condition');
      expect(li[1].textContent).to.contain('Test 1, Test 2, and Tinnitus');
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
      const handlers = { showModal: removeSpy };
      const { container } = render(
        <PrivateContent list={privateEvidence} handlers={handlers} testing />,
      );

      const buttons = $$('.remove-item', container);
      fireEvent.click(buttons[0]);
      expect(removeSpy.calledOnce).to.be.true;
      expect(removeSpy.args[0][0].target.getAttribute('data-index')).to.eq('0');
      expect(removeSpy.args[0][0].target.getAttribute('data-type')).to.eq(
        'private',
      );
      fireEvent.click(buttons[1]);
      expect(removeSpy.calledTwice).to.be.true;
      expect(removeSpy.args[1][0].target.getAttribute('data-index')).to.eq('1');
      expect(removeSpy.args[1][0].target.getAttribute('data-type')).to.eq(
        'private',
      );
    });
    it('should execute callback when removing the limitation', () => {
      const removeSpy = sinon.spy();
      const privateEvidence = records().providerFacility;
      const handlers = { showModal: removeSpy };
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
      expect(removeSpy.args[0][0].target.getAttribute('data-type')).to.eq(
        LIMITATION_KEY,
      );
    });
  });

  describe('buildUploadContent', () => {
    it('should render editable uploaded content', () => {
      const otherEvidence = records().additionalDocuments;
      const { container } = render(
        <UploadContent list={otherEvidence} testing />,
      );

      expect($('.upload-title', container).textContent).to.contain(
        content.otherTitle,
      );
      expect($$('ul[role="list"]', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.upload-file', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(2);
      expect($$('.remove-item', container).length).to.eq(2);
      // check Datadog classes
      expect(
        $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
      ).to.eq(2);
    });

    it('should render nothing when no data is passed in', () => {
      const { container } = render(
        <div>
          <UploadContent testing />
        </div>,
      );

      expect(container.innerHTML).to.eq('<div></div>');
    });

    it('should render review-only uploaded content', () => {
      const otherEvidence = records().additionalDocuments;
      const { container } = render(
        <UploadContent list={otherEvidence} reviewMode testing />,
      );

      expect($('.upload-title', container).textContent).to.contain(
        content.otherTitle,
      );
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.upload-file', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });
    it('should render list only for confirmation page content', () => {
      const otherEvidence = records().additionalDocuments;
      const { container } = render(
        <UploadContent list={otherEvidence} reviewMode showListOnly testing />,
      );

      expect($('.upload-title', container).textContent).to.contain(
        content.otherTitle,
      );
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.upload-file', container).length).to.eq(2);

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
      const handlers = { showModal: removeSpy };
      const { container } = render(
        <UploadContent list={otherEvidence} handlers={handlers} testing />,
      );

      const buttons = $$('.remove-item', container);
      fireEvent.click(buttons[0]);
      expect(removeSpy.calledOnce).to.be.true;
      expect(removeSpy.args[0][0].target.getAttribute('data-index')).to.eq('0');
      expect(removeSpy.args[0][0].target.getAttribute('data-type')).to.eq(
        'upload',
      );
      fireEvent.click(buttons[1]);
      expect(removeSpy.calledTwice).to.be.true;
      expect(removeSpy.args[1][0].target.getAttribute('data-index')).to.eq('1');
      expect(removeSpy.args[1][0].target.getAttribute('data-type')).to.eq(
        'upload',
      );
    });
  });
});
