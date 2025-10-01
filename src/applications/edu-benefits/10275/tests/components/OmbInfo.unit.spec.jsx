import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import OmbInfo from '../../components/OmbInfo';

describe('OmbInfo Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the component without crashing', () => {
    const { container } = render(<OmbInfo />);
    expect(container).to.exist;
  });

  it('should render the correct CSS classes', () => {
    const { container } = render(<OmbInfo />);
    const mainDiv = container.querySelector('.vads-u-margin-bottom--1p5');
    expect(mainDiv).to.exist;

    const paragraphs = container.querySelectorAll('.vads-u-margin--0');
    expect(paragraphs).to.have.lengthOf(3);
  });

  it('should display respondent burden information', () => {
    const { getByText } = render(<OmbInfo />);

    expect(getByText('Respondent burden:')).to.exist;
    expect(getByText('15 minutes')).to.exist;
  });

  it('should display OMB Control number', () => {
    const { getByText } = render(<OmbInfo />);

    expect(getByText('OMB Control #:')).to.exist;
    expect(getByText('2900-0718')).to.exist;
  });

  it('should display expiration date', () => {
    const { getByText } = render(<OmbInfo />);

    expect(getByText('Expiration date:')).to.exist;
    expect(getByText('01/31/2028')).to.exist;
  });

  it('should have bold styling for important values', () => {
    const { container } = render(<OmbInfo />);

    const boldElements = container.querySelectorAll(
      '.vads-u-font-weight--bold',
    );
    expect(boldElements).to.have.lengthOf(3);
    const boldTexts = Array.from(boldElements).map(el => el.textContent.trim());
    expect(boldTexts).to.include('15 minutes');
    expect(boldTexts).to.include('2900-0718');
    expect(boldTexts).to.include('01/31/2028');
  });

  it('should render all three paragraphs with correct structure', () => {
    const { container } = render(<OmbInfo />);

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).to.have.lengthOf(3);
    const firstParagraph = paragraphs[0];
    const firstSpans = firstParagraph.querySelectorAll('span');
    expect(firstSpans).to.have.lengthOf(2);
    expect(firstSpans[0].textContent.trim()).to.equal('Respondent burden:');
    expect(firstSpans[1].textContent.trim()).to.equal('15 minutes');
    const secondParagraph = paragraphs[1];
    const secondSpans = secondParagraph.querySelectorAll('span');
    expect(secondSpans).to.have.lengthOf(2);
    expect(secondSpans[0].textContent.trim()).to.equal('OMB Control #:');
    expect(secondSpans[1].textContent.trim()).to.equal('2900-0718');

    const thirdParagraph = paragraphs[2];
    const thirdSpans = thirdParagraph.querySelectorAll('span');
    expect(thirdSpans).to.have.lengthOf(2);
    expect(thirdSpans[0].textContent.trim()).to.equal('Expiration date:');
    expect(thirdSpans[1].textContent.trim()).to.equal('01/31/2028');
  });

  it('should have proper spacing between label and value', () => {
    const { container } = render(<OmbInfo />);

    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach(paragraph => {
      const text = paragraph.textContent;
      expect(text).to.match(/:\s+\d/);
    });
  });

  it('should be accessible with proper text content', () => {
    const { getByText } = render(<OmbInfo />);

    expect(getByText(/Respondent burden:/)).to.exist;
    expect(getByText(/OMB Control #:/)).to.exist;
    expect(getByText(/Expiration date:/)).to.exist;
    expect(getByText(/15 minutes/)).to.exist;
    expect(getByText(/2900-0718/)).to.exist;
    expect(getByText(/01\/31\/2028/)).to.exist;
  });
});
