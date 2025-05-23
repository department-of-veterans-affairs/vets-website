import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_LIMITATION_PATH,
  LIMITATION_KEY,
} from '../../constants';
import { content } from '../../content/evidenceSummary';
import { EvidencePrivateContent } from '../../components/EvidencePrivateContent';
import { records } from '../data/evidence-records';

describe('buildPrivateContent', () => {
  it('should render editable private content', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent="test"
        testing
      />,
    );

    expect($('.private-title', container).textContent).to.contain(
      content.privateTitle,
    );
    expect($$('ul', container).length).to.eq(1);
    expect($$('li', container).length).to.eq(3);
    expect($$('.private-limitation', container).length).to.eq(1);
    expect($$('.private-facility', container).length).to.eq(2);
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
        <EvidencePrivateContent testing />
      </div>,
    );

    expect(container.innerHTML).to.eq('<div></div>');
  });

  it('should not render limited consent section remove button', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent=""
        testing
      />,
    );
    expect($$('.private-facility', container).length).to.eq(2);
    expect($$('.private-limitation', container).length).to.eq(1);
    expect($$('.edit-item', container).length).to.eq(3);
    expect($$('.remove-item', container).length).to.eq(2);
  });
  it('should render review-only private content', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
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
    expect($$('.private-limitation', container).length).to.eq(1);
    expect($$('.private-facility', container).length).to.eq(2);
    expect($$('.edit-item', container).length).to.eq(0);
    expect($$('.remove-item', container).length).to.eq(0);
  });
  it('should show missing facility message', () => {
    const { container } = render(
      <EvidencePrivateContent list={['']} limitedConsent="" testing />,
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
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent=""
        testing
      />,
    );

    const li = $$('li', container);
    expect(li[0].textContent).to.contain('Missing condition');
    expect(li[1].textContent).to.contain('Test 1, Test 2, and Tinnitus');
  });
  it('should have edit links pointing to the appropriate private indexed page or limitation page', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent list={privateEvidence} testing />,
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
      <EvidencePrivateContent
        list={privateEvidence}
        handlers={handlers}
        testing
      />,
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
      <EvidencePrivateContent
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
