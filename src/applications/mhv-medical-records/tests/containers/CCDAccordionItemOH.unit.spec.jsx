import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import CCDAccordionItemOH from '../../containers/ccdAccordionItem/ccdAccordionItemOH';

describe('CCDAccordionItemOH', () => {
  const defaultProps = {
    generatingCCD: false,
    handleDownloadCCDV2: () => {},
  };

  it('renders Oracle Health CCD section', () => {
    const { getByText } = render(<CCDAccordionItemOH {...defaultProps} />);

    expect(getByText('Continuity of Care Document for non-VA providers')).to
      .exist;
    expect(getByText(/This Continuity of Care Document \(CCD\) is a summary/))
      .to.exist;
  });

  it('shows loading spinner when generatingCCD is true', () => {
    const props = { ...defaultProps, generatingCCD: true };
    const { getByTestId, queryByTestId } = render(
      <CCDAccordionItemOH {...props} />,
    );

    expect(getByTestId('generating-ccd-oh-indicator')).to.exist;

    expect(queryByTestId('generateCcdButtonXmlOH')).to.not.exist;
    expect(queryByTestId('generateCcdButtonPdfOH')).to.not.exist;
    expect(queryByTestId('generateCcdButtonHtmlOH')).to.not.exist;
  });

  it('renders all 3 Oracle Health download links when not loading', () => {
    const { getByTestId } = render(<CCDAccordionItemOH {...defaultProps} />);

    expect(getByTestId('generateCcdButtonXmlOH')).to.exist;
    expect(getByTestId('generateCcdButtonPdfOH')).to.exist;
    expect(getByTestId('generateCcdButtonHtmlOH')).to.exist;
  });

  it('calls handleDownloadCCDV2 with correct format when links clicked', () => {
    let calledWith = null;
    const mockHandler = (e, format) => {
      calledWith = format;
    };

    const props = { ...defaultProps, handleDownloadCCDV2: mockHandler };
    const { getByTestId } = render(<CCDAccordionItemOH {...props} />);

    fireEvent.click(getByTestId('generateCcdButtonXmlOH'));
    expect(calledWith).to.equal('xml');

    fireEvent.click(getByTestId('generateCcdButtonPdfOH'));
    expect(calledWith).to.equal('pdf');

    fireEvent.click(getByTestId('generateCcdButtonHtmlOH'));
    expect(calledWith).to.equal('html');
  });

  it('has correct data attributes for Datadog tracking', () => {
    const { getByTestId } = render(<CCDAccordionItemOH {...defaultProps} />);

    const xmlLink = getByTestId('generateCcdButtonXmlOH');
    const pdfLink = getByTestId('generateCcdButtonPdfOH');
    const htmlLink = getByTestId('generateCcdButtonHtmlOH');

    expect(xmlLink.getAttribute('data-dd-action-name')).to.equal(
      'Download CCD XML OH',
    );
    expect(pdfLink.getAttribute('data-dd-action-name')).to.equal(
      'Download CCD PDF OH',
    );
    expect(htmlLink.getAttribute('data-dd-action-name')).to.equal(
      'Download CCD HTML OH',
    );
  });
});
