import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';

describe('<FrequentlyAskedQuestions />', () => {
  it('renders without crashing', () => {
    const screen = render(<FrequentlyAskedQuestions />);
    expect(screen.getByText('Frequently asked questions')).to.exist;
  });

  it('renders all FAQ items with correct headers', () => {
    render(<FrequentlyAskedQuestions />);

    // Check that all headers are rendered
    expect(
      document.querySelector(
        'va-accordion-item[header="What if my Veteran Status Card displays incorrect information?"]',
      ),
    ).to.exist;
    expect(
      document.querySelector(
        'va-accordion-item[header="How can I use the Veteran Status Card?"]',
      ),
    ).to.exist;
    expect(
      document.querySelector(
        'va-accordion-item[header="How do I get a physical version of my Veteran Status Card?"]',
      ),
    ).to.exist;
    expect(
      document.querySelector(
        'va-accordion-item[header="What other types of Veteran ID are available?"]',
      ),
    ).to.exist;
  });

  it('renders "Print your Veteran Status Card" link when createPdf is provided', () => {
    render(<FrequentlyAskedQuestions createPdf={() => {}} />);

    // Check that the link is rendered
    expect(
      document.querySelector(
        'va-link[text="Print your Veteran Status Card (PDF)"]',
      ),
    ).to.exist;
  });

  it('does not render "Print your Veteran Status Card" link when createPdf is not provided', () => {
    render(<FrequentlyAskedQuestions />);

    // Check that the link is not rendered
    expect(
      document.querySelector(
        'va-link[text="Print your Veteran Status Card (PDF)"]',
      ),
    ).to.not.exist;
  });

  it('calls createPdf when "Print your Veteran Status Card" link is clicked', () => {
    const mockCreatePdf = sinon.spy();
    render(<FrequentlyAskedQuestions createPdf={mockCreatePdf} />);

    // Click the link
    const printLink = document.querySelector(
      'va-link[text="Print your Veteran Status Card (PDF)"]',
    );
    fireEvent.click(printLink);

    // Check that createPdf was called
    expect(mockCreatePdf.calledOnce).to.be.true;
  });

  it('renders telephone numbers and external links', () => {
    render(<FrequentlyAskedQuestions />);

    // Check that telephone numbers are rendered
    expect(document.querySelector('va-telephone[contact="711"]')).to.exist;
    expect(document.querySelector('va-telephone[contact="8008271000"]')).to
      .exist;
    expect(document.querySelector('va-telephone[contact="8005389552"]')).to
      .exist;

    // Check that external links are rendered
    const learnMoreLink = document.querySelector(
      'va-link[text="Learn about other types of Veteran ID cards"]',
    );
    expect(learnMoreLink).to.exist;
    expect(learnMoreLink.getAttribute('href')).to.equal(
      '/records/get-veteran-id-cards/',
    );
  });
});
