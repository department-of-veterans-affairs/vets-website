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
  LIMITATION_KEY,
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

const records = ({ emptyIssue = false } = {}) => ({
  locations: [
    {
      locationAndName: 'VAMC Location 1',
      issues: emptyIssue ? [] : ['Test 1'],
      evidenceDates: { from: '2001-01-01', to: '2011-01-01' },
    },
    {
      locationAndName: 'VAMC Location 2',
      issues: ['Test 1', 'Test 2'],
      evidenceDates: { from: '2002-02-02', to: '2012-02-02' },
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
      const { container } = render(<VaContent list={vaEvidence} testing />);

      expect($('h4', container).textContent).to.contain(content.vaTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(2);
      expect($$('h5', container).length).to.eq(2);
      expect($$('.remove-item', container).length).to.eq(2);
      // check Datadog classes
      expect(
        $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
      ).to.eq(6); // 3 x 2 entries
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
        <VaContent list={vaEvidence} reviewMode testing />,
      );

      expect($('h5', container).textContent).to.contain(content.vaTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('h6', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });

    it('should show missing issues message', () => {
      const vaEvidence = records({ emptyIssue: true }).locations;
      const { container } = render(<VaContent list={vaEvidence} testing />);

      const li = $$('li', container);
      expect(li[0].textContent).to.contain('Missing condition');
      expect(li[1].textContent).to.contain('Test 1 and Test 2');
    });
    it('should show missing location name & treatment dates', () => {
      const vaEvidence = [
        {
          locationAndName: '',
          issues: [],
          evidenceDates: { from: '--', to: '' },
        },
      ];
      const { container } = render(<VaContent list={vaEvidence} testing />);

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing location name');
      expect(li.textContent).to.contain('Missing treatment dates');
    });
    it('should show missing location message with partial list', () => {
      const { container } = render(
        <div>
          <VaContent list={['']} testing />
        </div>,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing location name');
    });
    it('should show missing start treatment date', () => {
      const vaEvidence = [{ evidenceDates: { from: '2000-1-1', to: '' } }];
      const { container } = render(<VaContent list={vaEvidence} testing />);

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing end date');
    });
    it('should show missing end treatment date', () => {
      const vaEvidence = [{ evidenceDates: { from: '--', to: '2000-1-1' } }];
      const { container } = render(<VaContent list={vaEvidence} testing />);

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing start date');
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
      const handlers = { showModal: removeSpy };
      const { container } = render(
        <VaContent list={vaEvidence} handlers={handlers} testing />,
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
        <PrivateContent list={privateEvidence} limitedConsent="test" testing />,
      );

      expect($('h4', container).textContent).to.contain(content.privateTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(3);
      // Includes limited consent
      expect($$('h5', container).length).to.eq(3);
      expect($$('.edit-item', container).length).to.eq(3);
      expect($$('.remove-item', container).length).to.eq(3);
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
      // Includes limited consent
      expect($$('h5', container).length).to.eq(3);
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
      // Includes limited consent
      expect($$('h6', container).length).to.eq(3);
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

      expect($('h4', container).textContent).to.contain(content.otherTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('h5', container).length).to.eq(2);
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

      expect($('h5', container).textContent).to.contain(content.otherTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('h6', container).length).to.eq(2);
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
