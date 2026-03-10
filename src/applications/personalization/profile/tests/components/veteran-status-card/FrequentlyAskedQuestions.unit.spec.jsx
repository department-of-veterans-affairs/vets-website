import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import FrequentlyAskedQuestions from '../../../components/veteran-status-card/FrequentlyAskedQuestions';

describe('<FrequentlyAskedQuestions />', () => {
  it('renders without crashing', () => {
    const screen = render(<FrequentlyAskedQuestions />);
    expect(screen.getByText('Frequently asked questions')).to.exist;
  });

  it('renders all FAQ items when createPdf is provided', () => {
    render(<FrequentlyAskedQuestions createPdf={() => {}} />);

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

  it('does not render "Print your Veteran Status Card" link when createPdf is not provided', () => {
    render(<FrequentlyAskedQuestions />);

    // Check that the link is not rendered
    expect(
      document.querySelector(
        'va-link[text="Print your Veteran Status Card (PDF)"]',
      ),
    ).to.not.exist;
  });

  it('renders old service PDF error alert when pdfError is true and cveVeteranStatusNewService is false', () => {
    const { getByText } = render(
      <FrequentlyAskedQuestions
        createPdf={() => {}}
        pdfError
        cveVeteranStatusNewService={false}
      />,
    );

    expect(
      getByText("We're sorry. Try to print your Veteran Status Card later."),
    ).to.exist;
  });

  it('renders new service PDF error alert when pdfError is true and cveVeteranStatusNewService is true', () => {
    const { getByText } = render(
      <FrequentlyAskedQuestions
        createPdf={() => {}}
        pdfError
        cveVeteranStatusNewService
      />,
    );

    expect(getByText('Something went wrong')).to.exist;
    expect(
      getByText(
        "We're sorry. Something went wrong on our end. Refresh this page or try again later.",
      ),
    ).to.exist;
  });

  it('calls createPdf when "Print your Veteran Status Card" link is clicked', () => {
    const mockCreatePdf = sinon.spy();
    render(<FrequentlyAskedQuestions createPdf={mockCreatePdf} />);

    // Click the link
    const pdfLink = document.querySelector(
      'va-link[text="Print your Veteran Status Card (PDF)"]',
    );
    fireEvent.click(pdfLink);

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

  describe('when cveVeteranStatusNewService is false (old service)', () => {
    it('should render the "incorrect information" accordion item and Defense Manpower Data Center paragraph', () => {
      const { getByText } = render(
        <FrequentlyAskedQuestions cveVeteranStatusNewService={false} />,
      );

      expect(
        document.querySelector(
          'va-accordion-item[header="What if my Veteran Status Card displays incorrect information?"]',
        ),
      ).to.exist;
      expect(getByText(/Defense Manpower Data Center/i)).to.exist;
    });

    it('should render the PDF link with filetype attribute (no download icon)', () => {
      render(
        <FrequentlyAskedQuestions
          createPdf={() => {}}
          cveVeteranStatusNewService={false}
        />,
      );

      const pdfLink = document.querySelector(
        'va-link[text="Print your Veteran Status Card (PDF)"]',
      );
      expect(pdfLink).to.exist;
      expect(pdfLink.hasAttribute('filetype')).to.be.true;
      expect(pdfLink.hasAttribute('download')).to.be.false;
    });
  });

  describe('when cveVeteranStatusNewService is true and Veteran Status Card is present (createPdf provided)', () => {
    it('should render all four accordion items without the Defense Manpower Data Center paragraph', () => {
      const { queryByText } = render(
        <FrequentlyAskedQuestions
          createPdf={() => {}}
          cveVeteranStatusNewService
        />,
      );

      // All four accordion items should be present
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

      // Defense Manpower Data Center paragraph should not be present in new service
      expect(queryByText(/Defense Manpower Data Center/i)).to.not.exist;
    });

    it('should render the PDF link with download icon', () => {
      render(
        <FrequentlyAskedQuestions
          createPdf={() => {}}
          cveVeteranStatusNewService
        />,
      );

      const pdfLink = document.querySelector(
        'va-link[text="Print your Veteran Status Card (PDF)"]',
      );
      expect(pdfLink).to.exist;
      expect(pdfLink.hasAttribute('download')).to.be.true;
      expect(pdfLink.hasAttribute('filetype')).to.be.false;
    });
  });

  describe('when cveVeteranStatusNewService is true and Veteran Status Card is not present (createPdf is null)', () => {
    it('should hide "incorrect information" and "physical version" accordion items, but show the other two', () => {
      render(
        <FrequentlyAskedQuestions
          createPdf={null}
          cveVeteranStatusNewService
        />,
      );

      // These two should NOT be rendered when card is not present
      expect(
        document.querySelector(
          'va-accordion-item[header="What if my Veteran Status Card displays incorrect information?"]',
        ),
      ).to.not.exist;
      expect(
        document.querySelector(
          'va-accordion-item[header="How do I get a physical version of my Veteran Status Card?"]',
        ),
      ).to.not.exist;

      // These two should still be rendered
      expect(
        document.querySelector(
          'va-accordion-item[header="How can I use the Veteran Status Card?"]',
        ),
      ).to.exist;
      expect(
        document.querySelector(
          'va-accordion-item[header="What other types of Veteran ID are available?"]',
        ),
      ).to.exist;
    });
  });
});
