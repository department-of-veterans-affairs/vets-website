import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { EVIDENCE_VA_PATH } from '../../constants';
import { content } from '../../content/evidenceSummary';
import { EvidenceVaContent } from '../../components/EvidenceVaContent';
import { records } from '../data/evidence-records';

describe('evidenceSummaryList', () => {
  describe('buildVaContent', () => {
    it('should render editable VA content', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} testing />,
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
      ).to.eq(4);
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
        <EvidenceVaContent list={vaEvidence} reviewMode testing />,
      );

      expect($('.va-title', container).textContent).to.contain(content.vaTitle);
      expect($$('ul', container).length).to.eq(1);
      expect($$('li', container).length).to.eq(2);
      expect($$('.edit-item', container).length).to.eq(0);
      expect($$('.remove-item', container).length).to.eq(0);
    });

    it('should show missing issues message', () => {
      const vaEvidence = records({ emptyIssue: true }).locations;
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} testing />,
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
          evidenceDates: { from: '--', to: '' },
        },
      ];
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} testing />,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing location name');
      expect(li.textContent).to.contain('Missing treatment dates');
    });
    it('should show missing location message with partial list', () => {
      const { container } = render(
        <div>
          <EvidenceVaContent list={['']} testing />
        </div>,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing location name');
    });
    it('should show missing start treatment date', () => {
      const vaEvidence = [{ evidenceDates: { from: '2000-1-1', to: '' } }];
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} testing />,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing end date');
    });
    it('should show missing end treatment date', () => {
      const vaEvidence = [{ evidenceDates: { from: '--', to: '2000-1-1' } }];
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} testing />,
      );

      const li = $('li', container);
      expect(li.textContent).to.contain('Missing start date');
    });

    it('should have edit links pointing to the appropriate VA indexed page', () => {
      const vaEvidence = records().locations;
      const { container } = render(
        <EvidenceVaContent list={vaEvidence} testing />,
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
        <EvidenceVaContent list={vaEvidence} handlers={handlers} testing />,
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
