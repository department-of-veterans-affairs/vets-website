import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import CCDAccordionItemDual from '../../containers/ccdAccordionItem/ccdAccordionItemDual';

describe('CCDAccordionItemDual', () => {
  const defaultProps = {
    generatingCCD: false,
    handleDownloadCCD: () => {},
    handleDownloadCCDV2: () => {},
  };

  it('renders both VistA and Oracle Health sections', () => {
    const { getByText } = render(<CCDAccordionItemDual {...defaultProps} />);

    expect(getByText('Your VA Medical Records (Legacy System)')).to.exist;
    expect(getByText('Your VA Medical Records (Oracle Health)')).to.exist;
  });

  it('shows VistA loading spinner when generatingCCD is true', () => {
    const props = { ...defaultProps, generatingCCD: true };
    const { getByTestId, queryByTestId } = render(
      <CCDAccordionItemDual {...props} />,
    );

    expect(getByTestId('generating-ccd-Vista-indicator')).to.exist;

    expect(queryByTestId('generateCcdButtonXmlVista')).to.not.exist;
  });

  it('shows Oracle Health loading spinner when generatingCCD is true', () => {
    const props = { ...defaultProps, generatingCCD: true };
    const { getByTestId, queryByTestId } = render(
      <CCDAccordionItemDual {...props} />,
    );

    expect(getByTestId('generating-ccd-OH-indicator')).to.exist;

    expect(queryByTestId('generateCcdButtonXmlOH')).to.not.exist;
  });

  it('renders all 6 download links when not loading', () => {
    const { getByTestId } = render(<CCDAccordionItemDual {...defaultProps} />);

    expect(getByTestId('generateCcdButtonXmlVista')).to.exist;
    expect(getByTestId('generateCcdButtonPdfVista')).to.exist;
    expect(getByTestId('generateCcdButtonHtmlVista')).to.exist;

    expect(getByTestId('generateCcdButtonXmlOH')).to.exist;
    expect(getByTestId('generateCcdButtonPdfOH')).to.exist;
    expect(getByTestId('generateCcdButtonHtmlOH')).to.exist;
  });

  it('calls handleDownloadCCD when VistA link clicked', () => {
    let calledWith = null;
    const mockHandler = (e, format) => {
      calledWith = format;
    };

    const props = { ...defaultProps, handleDownloadCCD: mockHandler };
    const { getByTestId } = render(<CCDAccordionItemDual {...props} />);

    fireEvent.click(getByTestId('generateCcdButtonXmlVista'));
    expect(calledWith).to.equal('xml');

    fireEvent.click(getByTestId('generateCcdButtonPdfVista'));
    expect(calledWith).to.equal('pdf');
  });

  it('calls handleDownloadCCDV2 when Oracle Health link clicked', () => {
    let calledWith = null;
    const mockHandler = (e, format) => {
      calledWith = format;
    };

    const props = { ...defaultProps, handleDownloadCCDV2: mockHandler };
    const { getByTestId } = render(<CCDAccordionItemDual {...props} />);

    fireEvent.click(getByTestId('generateCcdButtonXmlOH'));
    expect(calledWith).to.equal('xml');

    fireEvent.click(getByTestId('generateCcdButtonHtmlOH'));
    expect(calledWith).to.equal('html');
  });

  it('shows both spinners when generatingCCD is true', () => {
    const props = {
      ...defaultProps,
      generatingCCD: true,
    };
    const { getByTestId } = render(<CCDAccordionItemDual {...props} />);

    expect(getByTestId('generating-ccd-Vista-indicator')).to.exist;
    expect(getByTestId('generating-ccd-OH-indicator')).to.exist;
  });
});
