import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { EVIDENCE_VA_PATH } from '../../constants';
import { content } from '../../content/evidenceSummary';
import { content as vaContent } from '../../content/evidenceVaRecords';
import { EvidenceVaContent } from '../../components/EvidenceVaContent';
import { records } from '../data/evidence-records';

describe('evidenceSummaryList', () => {
  describe('buildVaContent', () => {
    it('should render editable VA content', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} showScNewForm testing />,
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
          <EvidenceVaContent testing />
        </div>,
      );

      expect(container.innerHTML).to.eq('<div></div>');
    });

    it('should render review-only VA content', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <EvidenceVaContent
          list={vaEvidence}
          showScNewForm
          reviewMode
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

    it('should render list only for confirmation page content', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <EvidenceVaContent
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
        <EvidenceVaContent list={vaEvidence} showScNewForm testing />,
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
        <EvidenceVaContent list={vaEvidence} showScNewForm testing />,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing location name');
      expect(li.textContent).to.contain('Missing treatment date');
    });
    it('should show missing location message with partial list', () => {
      const { container } = render(
        <div>
          <EvidenceVaContent list={['']} showScNewForm testing />
        </div>,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing location name');
    });
    it('should show missing treatment date', () => {
      const vaEvidence = [{ treatmentDate: '' }];
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} showScNewForm testing />,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing treatment date');
    });

    it('should not show missing treatment date when no date checkbox is selected', () => {
      const vaEvidence = [{ treatmentDate: '', noDate: true }];
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} showScNewForm testing />,
      );

      const li = $('li', container);
      expect(li.textContent).to.not.contain('Missing treatment date');
      expect(li.textContent).to.contain(vaContent.noDate);
    });

    it('should have edit links pointing to the appropriate VA indexed page', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} showScNewForm testing />,
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
        <EvidenceVaContent
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
});
