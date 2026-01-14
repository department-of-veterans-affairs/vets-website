import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import CCDAccordionItemV2 from '../../containers/ccdAccordionItem/ccdAccordionItemV2';

describe('CCDAccordionItemV2', () => {
  const defaultProps = {
    generatingCCD: false,
    handleDownloadCCD: () => {},
  };

  it('renders VistA CCD section', () => {
    const { getByText } = render(<CCDAccordionItemV2 {...defaultProps} />);

    expect(getByText('Continuity of Care Document for non-VA providers')).to
      .exist;
    expect(getByText(/This Continuity of Care Document \(CCD\) is a summary/))
      .to.exist;
  });

  it('shows loading spinner when generatingCCD is true', () => {
    const props = { ...defaultProps, generatingCCD: true };
    const { getByTestId, queryByTestId } = render(
      <CCDAccordionItemV2 {...props} />,
    );

    expect(getByTestId('generating-ccd-indicator')).to.exist;

    expect(queryByTestId('generateCcdButtonXml')).to.not.exist;
    expect(queryByTestId('generateCcdButtonPdf')).to.not.exist;
    expect(queryByTestId('generateCcdButtonHtml')).to.not.exist;
  });

  it('renders all 3 VistA download links when not loading', () => {
    const { getByTestId } = render(<CCDAccordionItemV2 {...defaultProps} />);

    expect(getByTestId('generateCcdButtonXml')).to.exist;
    expect(getByTestId('generateCcdButtonPdf')).to.exist;
    expect(getByTestId('generateCcdButtonHtml')).to.exist;
  });

  it('calls handleDownloadCCD with correct format when links clicked', () => {
    let calledWith = null;
    const mockHandler = (e, format) => {
      calledWith = format;
    };

    const props = { ...defaultProps, handleDownloadCCD: mockHandler };
    const { getByTestId } = render(<CCDAccordionItemV2 {...props} />);

    fireEvent.click(getByTestId('generateCcdButtonXml'));
    expect(calledWith).to.equal('xml');

    fireEvent.click(getByTestId('generateCcdButtonPdf'));
    expect(calledWith).to.equal('pdf');

    fireEvent.click(getByTestId('generateCcdButtonHtml'));
    expect(calledWith).to.equal('html');
  });

  it('has correct data attributes for Datadog tracking', () => {
    const { getByTestId } = render(<CCDAccordionItemV2 {...defaultProps} />);

    const xmlLink = getByTestId('generateCcdButtonXml');
    const pdfLink = getByTestId('generateCcdButtonPdf');
    const htmlLink = getByTestId('generateCcdButtonHtml');

    expect(xmlLink.getAttribute('data-dd-action-name')).to.equal(
      'Download CCD XML',
    );
    expect(pdfLink.getAttribute('data-dd-action-name')).to.equal(
      'Download CCD PDF',
    );
    expect(htmlLink.getAttribute('data-dd-action-name')).to.equal(
      'Download CCD HTML',
    );
  });
});
