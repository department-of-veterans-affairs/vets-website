import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_LIMITATION_PATH1,
  EVIDENCE_LIMITATION_PATH2,
} from '../../constants';
import { content } from '../../content/evidenceSummary';
import { EvidencePrivateContent } from '../../components/EvidencePrivateContent';
import { records } from '../data/evidence-records';

describe('buildPrivateContent', () => {
  it('should render editable private content with new form structure', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent="test"
        privacyAgreementAccepted
        showLimitedConsentYN
        testing
      />,
    );
    expect($('.private-title', container).textContent).to.contain(
      content.privateTitle,
    );
    expect($$('ul[role="list"]', container).length).to.eq(1);
    // Updated count: authorization + limitation Y/N + limitation text area + 2 facilities = 5 items
    expect($$('li', container).length).to.eq(5);
    expect($$('.private-facility', container).length).to.eq(2);
    expect($$('.private-limitation-yn', container).length).to.eq(1);
    expect($$('.private-limitation', container).length).to.eq(1);
    // Updated count: authorization + limitation Y/N + limitation text area + 2 facilities = 5 edit items
    expect($$('.edit-item', container).length).to.eq(5);
    expect($$('.remove-item', container).length).to.eq(2);
    // check Datadog classes - facilities only have privacy classes
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

  it('should not render limited consent text area when showLimitedConsentYN is false', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent="test"
        privacyAgreementAccepted
        showLimitedConsentYN={false}
        testing
      />,
    );
    expect($$('.private-facility', container).length).to.eq(2);
    expect($$('.private-limitation-yn', container).length).to.eq(1);
    expect($$('.private-limitation', container).length).to.eq(0);
    expect($$('.edit-item', container).length).to.eq(4);
    expect($$('.remove-item', container).length).to.eq(2);
  });

  it('should render review-only private content', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent="test"
        privacyAgreementAccepted
        showLimitedConsentYN
        reviewMode
        testing
      />,
    );

    expect($('.private-title', container).textContent).to.contain(
      content.privateTitle,
    );
    expect($$('ul', container).length).to.eq(1);
    // authorization + limitation Y/N + limitation text area + 2 facilities = 5 items
    expect($$('li', container).length).to.eq(5);
    expect($$('.private-facility', container).length).to.eq(2);
    expect($$('.private-limitation-yn', container).length).to.eq(1);
    expect($$('.private-limitation', container).length).to.eq(1);
    expect($$('.edit-item', container).length).to.eq(0);
    expect($$('.remove-item', container).length).to.eq(0);
  });

  it('should render list only for confirmation page content', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent="test"
        privacyAgreementAccepted
        showLimitedConsentYN
        reviewMode
        showListOnly
        testing
      />,
    );

    expect($('.private-title', container).textContent).to.contain(
      content.privateTitle,
    );
    expect($$('ul', container).length).to.eq(1);
    expect($$('li', container).length).to.eq(5);
    expect($$('.private-facility', container).length).to.eq(2);
    expect($$('.private-limitation-yn', container).length).to.eq(1);
    expect($$('.private-limitation', container).length).to.eq(1);
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
        privacyAgreementAccepted
        showLimitedConsentYN={false}
        testing
      />,
    );

    const li = $$('li', container);

    expect(li[2].textContent).to.contain('Missing condition');
    expect(li[3].textContent).to.contain('Test 1, Test 2, and Tinnitus');
  });

  it('should have edit links pointing to the appropriate private indexed page and limitation pages', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent="test"
        privacyAgreementAccepted
        showLimitedConsentYN
        testing
      />,
    );

    const links = $$('.edit-item', container);
    // First link is authorization (index 0)
    expect(links[0].getAttribute('data-link')).to.contain('authorization');
    // Second link is limitation Y/N (index 1)
    expect(links[1].getAttribute('data-link')).to.contain(
      EVIDENCE_LIMITATION_PATH1,
    );
    // Third link is limitation text area (index 2)
    expect(links[2].getAttribute('data-link')).to.contain(
      EVIDENCE_LIMITATION_PATH2,
    );
    // Fourth and fifth links are facilities (index 3, 4)
    expect(links[3].getAttribute('data-link')).to.contain(
      `${EVIDENCE_PRIVATE_PATH}?index=0`,
    );
    expect(links[4].getAttribute('data-link')).to.contain(
      `${EVIDENCE_PRIVATE_PATH}?index=1`,
    );
  });

  it('should execute callback when removing an entry', () => {
    const removeSpy = sinon.spy();
    const privateEvidence = records().providerFacility;
    const handlers = { showModal: removeSpy };
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent=""
        privacyAgreementAccepted
        showLimitedConsentYN={false}
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

  it('should display authorization error message when privacy agreement not accepted', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent=""
        privacyAgreementAccepted={false}
        showLimitedConsentYN={false}
        testing
      />,
    );

    expect(container.textContent).to.contain(
      'You must give us authorization for us to get your non-VA medical records',
    );
  });

  it('should display "Yes" when showLimitedConsentYN is true', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent="test limitation"
        privacyAgreementAccepted
        showLimitedConsentYN
        testing
      />,
    );

    const limitationYN = $('.private-limitation-yn', container).parentElement;
    expect(limitationYN.textContent).to.contain('Yes');
  });

  it('should display "No" when showLimitedConsentYN is false', () => {
    const privateEvidence = records().providerFacility;
    const { container } = render(
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsent=""
        privacyAgreementAccepted
        showLimitedConsentYN={false}
        testing
      />,
    );

    const limitationYN = $('.private-limitation-yn', container).parentElement;
    expect(limitationYN.textContent).to.contain('No');
  });
});
