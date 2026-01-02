import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CCDDownloadSection, {
  CCDDownloadLinksExtended,
  CCDDownloadLinksBasic,
} from '../../../components/DownloadRecords/CCDDownloadSection';

describe('CCDDownloadLinksExtended', () => {
  let handleDownload;

  beforeEach(() => {
    handleDownload = sinon.stub();
  });

  it('renders all three download links', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksExtended
        ddSuffix="OH"
        handleDownload={handleDownload}
        testIdSuffix="oh"
      />,
    );

    expect(getByTestId('generateCcdButtonXmloh')).to.exist;
    expect(getByTestId('generateCcdButtonPdfoh')).to.exist;
    expect(getByTestId('generateCcdButtonHtmloh')).to.exist;
  });

  it('renders XML link with correct text', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksExtended
        ddSuffix="OH"
        handleDownload={handleDownload}
        testIdSuffix="oh"
      />,
    );

    const xmlLink = getByTestId('generateCcdButtonXmloh');
    expect(xmlLink.getAttribute('text')).to.equal(
      'Download XML (best for sharing with your provider)',
    );
  });

  it('renders PDF link with correct text', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksExtended
        ddSuffix="OH"
        handleDownload={handleDownload}
        testIdSuffix="oh"
      />,
    );

    const pdfLink = getByTestId('generateCcdButtonPdfoh');
    expect(pdfLink.getAttribute('text')).to.equal(
      'Download PDF (best for printing)',
    );
  });

  it('renders HTML link with correct text', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksExtended
        ddSuffix="OH"
        handleDownload={handleDownload}
        testIdSuffix="oh"
      />,
    );

    const htmlLink = getByTestId('generateCcdButtonHtmloh');
    expect(htmlLink.getAttribute('text')).to.equal(
      'Download HTML (best for screen readers, enlargers, and refreshable Braille displays)',
    );
  });

  it('calls handleDownload with xml when XML link is clicked', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksExtended
        ddSuffix="OH"
        handleDownload={handleDownload}
        testIdSuffix="oh"
      />,
    );

    const xmlLink = getByTestId('generateCcdButtonXmloh');
    fireEvent.click(xmlLink);

    expect(handleDownload.calledOnce).to.be.true;
    expect(handleDownload.firstCall.args[1]).to.equal('xml');
  });

  it('calls handleDownload with pdf when PDF link is clicked', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksExtended
        ddSuffix="OH"
        handleDownload={handleDownload}
        testIdSuffix="oh"
      />,
    );

    const pdfLink = getByTestId('generateCcdButtonPdfoh');
    fireEvent.click(pdfLink);

    expect(handleDownload.calledOnce).to.be.true;
    expect(handleDownload.firstCall.args[1]).to.equal('pdf');
  });

  it('calls handleDownload with html when HTML link is clicked', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksExtended
        ddSuffix="OH"
        handleDownload={handleDownload}
        testIdSuffix="oh"
      />,
    );

    const htmlLink = getByTestId('generateCcdButtonHtmloh');
    fireEvent.click(htmlLink);

    expect(handleDownload.calledOnce).to.be.true;
    expect(handleDownload.firstCall.args[1]).to.equal('html');
  });

  it('renders links with correct data-dd-action-name attributes', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksExtended
        ddSuffix="OH"
        handleDownload={handleDownload}
        testIdSuffix="oh"
      />,
    );

    expect(
      getByTestId('generateCcdButtonXmloh').getAttribute('data-dd-action-name'),
    ).to.equal('Download CCD XML OH');
    expect(
      getByTestId('generateCcdButtonPdfoh').getAttribute('data-dd-action-name'),
    ).to.equal('Download CCD PDF OH');
    expect(
      getByTestId('generateCcdButtonHtmloh').getAttribute(
        'data-dd-action-name',
      ),
    ).to.equal('Download CCD HTML OH');
  });
});

describe('CCDDownloadLinksBasic', () => {
  let handleDownload;

  beforeEach(() => {
    handleDownload = sinon.stub();
  });

  it('renders only XML download link', () => {
    const { getByTestId, queryByTestId } = render(
      <CCDDownloadLinksBasic
        ddSuffix="VistA"
        handleDownload={handleDownload}
        testIdSuffix="v1"
      />,
    );

    expect(getByTestId('generateCcdButtonXmlv1')).to.exist;
    expect(queryByTestId('generateCcdButtonPdfv1')).to.not.exist;
    expect(queryByTestId('generateCcdButtonHtmlv1')).to.not.exist;
  });

  it('renders XML link with correct text', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksBasic
        ddSuffix="VistA"
        handleDownload={handleDownload}
        testIdSuffix="v1"
      />,
    );

    const xmlLink = getByTestId('generateCcdButtonXmlv1');
    expect(xmlLink.getAttribute('text')).to.equal(
      'Download Continuity of Care Document (XML)',
    );
  });

  it('calls handleDownload with xml when XML link is clicked', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksBasic
        ddSuffix="VistA"
        handleDownload={handleDownload}
        testIdSuffix="v1"
      />,
    );

    const xmlLink = getByTestId('generateCcdButtonXmlv1');
    fireEvent.click(xmlLink);

    expect(handleDownload.calledOnce).to.be.true;
    expect(handleDownload.firstCall.args[1]).to.equal('xml');
  });

  it('renders link with correct data-dd-action-name attribute', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksBasic
        ddSuffix="VistA"
        handleDownload={handleDownload}
        testIdSuffix="v1"
      />,
    );

    expect(
      getByTestId('generateCcdButtonXmlv1').getAttribute('data-dd-action-name'),
    ).to.equal('Download CCD XML VistA');
  });

  it('renders with different testIdSuffix', () => {
    const { getByTestId } = render(
      <CCDDownloadLinksBasic
        ddSuffix="VistA"
        handleDownload={handleDownload}
        testIdSuffix="v2"
      />,
    );

    expect(getByTestId('generateCcdButtonXmlv2')).to.exist;
  });
});

describe('CCDDownloadSection', () => {
  let handleDownload;

  beforeEach(() => {
    handleDownload = sinon.stub();
  });

  it('renders loading spinner when isLoading is true', () => {
    const { getByTestId, queryByTestId } = render(
      <CCDDownloadSection
        isLoading
        handleDownload={handleDownload}
        testIdSuffix="oh"
        ddSuffix="OH"
      />,
    );

    expect(getByTestId('generating-ccd-oh-indicator')).to.exist;
    expect(queryByTestId('generateCcdButtonXmloh')).to.not.exist;
  });

  it('renders CCDDownloadLinksExtended when isExtendedFileType is true', () => {
    const { getByTestId, queryByTestId } = render(
      <CCDDownloadSection
        isLoading={false}
        isExtendedFileType
        handleDownload={handleDownload}
        testIdSuffix="oh"
        ddSuffix="OH"
      />,
    );

    expect(queryByTestId('generating-ccd-oh-indicator')).to.not.exist;
    expect(getByTestId('generateCcdButtonXmloh')).to.exist;
    expect(getByTestId('generateCcdButtonPdfoh')).to.exist;
    expect(getByTestId('generateCcdButtonHtmloh')).to.exist;
  });

  it('renders CCDDownloadLinksBasic when isExtendedFileType is false', () => {
    const { getByTestId, queryByTestId } = render(
      <CCDDownloadSection
        isLoading={false}
        isExtendedFileType={false}
        handleDownload={handleDownload}
        testIdSuffix="v1"
        ddSuffix="VistA"
      />,
    );

    expect(getByTestId('generateCcdButtonXmlv1')).to.exist;
    expect(queryByTestId('generateCcdButtonPdfv1')).to.not.exist;
    expect(queryByTestId('generateCcdButtonHtmlv1')).to.not.exist;
  });

  it('defaults to CCDDownloadLinksBasic when isExtendedFileType is not provided', () => {
    const { getByTestId, queryByTestId } = render(
      <CCDDownloadSection
        isLoading={false}
        handleDownload={handleDownload}
        testIdSuffix="v1"
        ddSuffix="VistA"
      />,
    );

    expect(getByTestId('generateCcdButtonXmlv1')).to.exist;
    expect(queryByTestId('generateCcdButtonPdfv1')).to.not.exist;
    expect(queryByTestId('generateCcdButtonHtmlv1')).to.not.exist;
  });

  it('calls handleDownload when download link is clicked', () => {
    const { getByTestId } = render(
      <CCDDownloadSection
        isLoading={false}
        isExtendedFileType
        handleDownload={handleDownload}
        testIdSuffix="oh"
        ddSuffix="OH"
      />,
    );

    const xmlLink = getByTestId('generateCcdButtonXmloh');
    fireEvent.click(xmlLink);

    expect(handleDownload.calledOnce).to.be.true;
    expect(handleDownload.firstCall.args[1]).to.equal('xml');
  });

  it('renders spinner with correct testIdSuffix', () => {
    const { getByTestId } = render(
      <CCDDownloadSection
        isLoading
        handleDownload={handleDownload}
        testIdSuffix="v2"
        ddSuffix="VistA"
      />,
    );

    expect(getByTestId('generating-ccd-v2-indicator')).to.exist;
  });

  it('renders correct data-dd-action-name attributes', () => {
    const { getByTestId } = render(
      <CCDDownloadSection
        isLoading={false}
        isExtendedFileType
        handleDownload={handleDownload}
        testIdSuffix="oh"
        ddSuffix="OH"
      />,
    );

    expect(
      getByTestId('generateCcdButtonXmloh').getAttribute('data-dd-action-name'),
    ).to.equal('Download CCD XML OH');
    expect(
      getByTestId('generateCcdButtonPdfoh').getAttribute('data-dd-action-name'),
    ).to.equal('Download CCD PDF OH');
    expect(
      getByTestId('generateCcdButtonHtmloh').getAttribute(
        'data-dd-action-name',
      ),
    ).to.equal('Download CCD HTML OH');
  });
});
