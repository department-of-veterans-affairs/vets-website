import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { renderWithRouter, rerenderWithRouter } from '../../utils';
import { Default5103EvidenceNotice } from '../../../components/claim-document-request-pages/Default5103EvidenceNotice';

const claimId = 1;

const automated5103 = {
  closedDate: null,
  description:
    'Review a list of evidence we may need to decide your claim (called a 5103 notice).',
  displayName: 'Automated 5103 Notice Response',
  id: 467558,
  overdue: true,
  receivedDate: null,
  requestedDate: '2024-03-07',
  status: 'NEEDED_FROM_YOU',
  suspenseDate: '2024-04-07',
  uploadsAllowed: true,
  documents: '[]',
  date: '2024-03-07',
};

const standard5103 = {
  description:
    'Review a list of evidence we may need to decide your claim (called a 5103 notice).',
  displayName: 'Review evidence list (5103 notice)',
};

describe('<Default5103EvidenceNotice>', () => {
  it('should render component when item is a 5103 notice', () => {
    const { getByText, getByTestId, container } = renderWithRouter(
      <Default5103EvidenceNotice
        item={standard5103}
        params={{ id: claimId }}
      />,
    );
    expect($('#default-5103-notice-page', container)).to.exist;
    getByText('Review evidence list (5103 notice)');
    expect($('.active-va-link', container)).to.have.text(
      'Find this letter on the claim letters page',
    );
    getByText('Submit additional evidence, if applicable');
    expect(getByTestId('upload-evidence-link').textContent).to.equal(
      'Upload additional evidence',
    );
    getByText(/Upload additional evidence/i);
    getByText('Submit an evidence waiver');
    expect($('va-checkbox', container)).to.exist;
    expect($('va-button', container)).to.exist;
  });

  it('should render null when item is NOT a 5103 notice', () => {
    const item = {
      closedDate: null,
      description: 'Buddy statement text',
      displayName: 'Submit buddy statement(s)',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2024-04-07',
      uploadsAllowed: true,
      documents: '[]',
      date: '2024-03-07',
    };

    const { container } = renderWithRouter(
      <Default5103EvidenceNotice
        item={item}
        params={{ id: claimId }}
        navigate={() => {}}
      />,
    );
    expect($('#default-5103-notice-page', container)).to.not.exist;
  });

  it('link has the correct href to upload additional evidence', () => {
    const { getByText } = renderWithRouter(
      <Default5103EvidenceNotice
        item={standard5103}
        params={{ id: claimId }}
      />,
    );

    const additionalEvidenceLink = getByText(/Upload additional evidence/i);
    expect(additionalEvidenceLink.getAttribute('href')).to.equal(
      '/files#add-files',
    );
  });

  context('submit5103', () => {
    const props = {
      item: automated5103,
      params: { id: claimId },
      useLighthouse5103: true,
    };

    context('when checkbox is checked and submit button clicked', () => {
      it('should submit5103 notice and redirect to files tab', () => {
        const navigate = sinon.spy();
        const submit5103 = sinon.spy();

        const { container, rerender } = renderWithRouter(
          <Default5103EvidenceNotice
            {...props}
            submit5103={submit5103}
            navigate={navigate}
            loadingDecisionRequest={false}
            decisionRequested
          />,
        );
        expect($('#default-5103-notice-page', container)).to.exist;
        expect($('va-checkbox', container)).to.exist;
        expect($('va-button', container)).to.exist;

        // Check the checkbox
        $('va-checkbox', container).__events.vaChange({
          detail: { checked: true },
        });

        rerenderWithRouter(
          rerender,
          <Default5103EvidenceNotice
            {...props}
            submit5103={submit5103}
            navigate={navigate}
            loadingDecisionRequest={false}
            decisionRequested
          />,
        );

        // Click submit button
        fireEvent.click($('#submit', container));

        expect(submit5103.called).to.be.true;
        expect(navigate.calledWith('../files')).to.be.true;
      });
    });

    context('when checkbox is not checked and submit button clicked', () => {
      it('should not submit 5103 notice and error message displayed', () => {
        const navigate = sinon.spy();
        const submit5103 = sinon.spy();

        const { container } = renderWithRouter(
          <Default5103EvidenceNotice
            {...props}
            submit5103={submit5103}
            navigate={navigate}
          />,
        );

        expect($('#default-5103-notice-page', container)).to.exist;
        expect($('va-checkbox', container)).to.exist;
        expect($('va-button', container)).to.exist;
        expect($('va-checkbox', container).getAttribute('error')).to.be.null;

        // Click submit button
        fireEvent.click($('#submit', container));

        expect($('va-checkbox', container).getAttribute('checked')).to.equal(
          'false',
        );
        expect(submit5103.called).to.be.false;
        expect(navigate.calledWith('../files')).to.be.false;
        expect($('va-checkbox', container).getAttribute('error')).to.equal(
          'You must confirm you’re done adding evidence before submitting the evidence waiver',
        );
      });
    });
  });
});
