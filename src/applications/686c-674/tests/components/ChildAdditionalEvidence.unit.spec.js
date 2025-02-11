import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ChildAdditionalEvidence } from '../../components/ChildAdditionalEvidence';

describe('ChildAdditionalEvidence', () => {
  let container;

  beforeEach(() => {
    ({ container } = render(<ChildAdditionalEvidence />));
  });

  it('should render the introductory text', () => {
    const introText = container.querySelector('p');
    expect(introText).to.not.be.null;
    expect(introText.textContent).to.include(
      'Based on your answers, you’ll need to submit supporting evidence to add this child as your dependent.',
    );
  });

  it('should render the accordion with supporting evidence details', () => {
    const evidenceAccordion = container.querySelector('#supporting-evidence');
    expect(evidenceAccordion).to.not.be.null;
    expect(evidenceAccordion.getAttribute('header')).to.equal(
      'Supporting evidence you need to submit',
    );
  });

  it('should render the submit your files section with online submission details', () => {
    const submitFilesHeader = container.querySelector('h3');
    expect(submitFilesHeader).to.not.be.null;
    expect(submitFilesHeader.textContent).to.include(
      'Submit your files online',
    );
  });

  it('should render the additional info component with upload instructions', () => {
    const uploadInstructions = container.querySelector('va-additional-info');
    expect(uploadInstructions).to.not.be.null;
    expect(uploadInstructions.getAttribute('trigger')).to.equal(
      'Document upload instructions',
    );
  });

  it('should have a correct structure for supporting evidence and upload sections', () => {
    const accordion = container.querySelector('va-accordion');
    const uploadSection = container.querySelector('va-additional-info');
    expect(accordion).to.not.be.null;
    expect(uploadSection).to.not.be.null;
  });
});
