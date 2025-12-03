import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { EVIDENCE_UPLOAD_URL } from '../../constants';
import { content } from '../../content/evidence/summary';
import { EvidenceUploadContent } from '../../components/EvidenceUploadContent';
import { records } from '../data/evidence-records';

describe('buildUploadContent', () => {
  it('should render editable uploaded content', () => {
    const otherEvidence = records().additionalDocuments;
    const { container } = render(
      <EvidenceUploadContent list={otherEvidence} testing />,
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
        <EvidenceUploadContent testing />
      </div>,
    );

    expect(container.innerHTML).to.eq('<div></div>');
  });

  it('should render review-only uploaded content', () => {
    const otherEvidence = records().additionalDocuments;
    const { container } = render(
      <EvidenceUploadContent list={otherEvidence} reviewMode testing />,
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
      <EvidenceUploadContent
        list={otherEvidence}
        reviewMode
        showListOnly
        testing
      />,
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
      <EvidenceUploadContent list={otherEvidence} testing />,
    );

    const links = $$('.edit-item', container);
    expect(links[0].getAttribute('data-link')).to.contain(EVIDENCE_UPLOAD_URL);
    expect(links[1].getAttribute('data-link')).to.contain(EVIDENCE_UPLOAD_URL);
  });
  it('should execute callback when removing an upload', () => {
    const removeSpy = sinon.spy();
    const otherEvidence = records().additionalDocuments;
    const handlers = { showModal: removeSpy };
    const { container } = render(
      <EvidenceUploadContent
        list={otherEvidence}
        handlers={handlers}
        testing
      />,
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
