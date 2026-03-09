import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import PrintDownloadCard from '../../../components/shared/PrintDownloadCard';

describe('PrintDownloadCard component', () => {
  let onDownloadSpy;
  let onPrintSpy;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    onDownloadSpy = sandbox.spy();
    onPrintSpy = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderComponent = (props = {}) => {
    return render(
      <PrintDownloadCard
        onDownload={onDownloadSpy}
        onPrint={onPrintSpy}
        isSuccess={false}
        isLoading={false}
        {...props}
      />,
    );
  };

  it('should render without crashing', () => {
    const { getByText, container } = renderComponent();
    expect(getByText('Print or download your medications list')).to.exist;
    const select = container.querySelector('va-select');
    expect(select.getAttribute('label')).to.equal('Print or download options');
  });

  it('should render the warning alert', () => {
    const { container } = renderComponent();
    const warningAlert = container.querySelector('va-alert[status="warning"]');
    expect(warningAlert).to.exist;
  });

  it('should render the select with options', () => {
    const { container } = renderComponent();
    const select = container.querySelector('va-select');
    expect(select).to.exist;
    expect(select.getAttribute('label')).to.equal('Print or download options');

    const options = select.querySelectorAll('option');
    expect(options.length).to.equal(3);
    expect(options[0].value).to.equal('print');
    expect(options[1].value).to.equal('pdf');
    expect(options[2].value).to.equal('txt');
  });

  it('should render the submit button', () => {
    const { container } = renderComponent();
    const button = container.querySelector('va-button');
    expect(button).to.exist;
    expect(button.getAttribute('text')).to.equal('Submit');
  });

  it('should show loading indicator when isLoading is true', () => {
    const { getByTestId } = renderComponent({ isLoading: true });
    expect(getByTestId('print-download-card-loading')).to.exist;
  });

  it('should show success alert when isSuccess is true', () => {
    const { container, getByText } = renderComponent({ isSuccess: true });
    const successAlert = container.querySelector('va-alert[status="success"]');
    expect(successAlert).to.exist;
    expect(getByText('Download started')).to.exist;
  });

  it('should not show success alert when isSuccess is false', () => {
    const { container } = renderComponent({ isSuccess: false });
    const successAlert = container.querySelector('va-alert[status="success"]');
    expect(successAlert).to.not.exist;
  });

  describe('submit button functionality', () => {
    it('should call onPrint when print option is selected and submit is clicked', async () => {
      const { container } = renderComponent();
      const button = container.querySelector('va-button');

      // Click submit (print is default)
      button.click();

      await waitFor(() => {
        expect(onPrintSpy.calledOnce).to.be.true;
      });
    });

    it('should call onDownload when onPrint is not provided', async () => {
      const { container } = render(
        <PrintDownloadCard
          onDownload={onDownloadSpy}
          isSuccess={false}
          isLoading={false}
        />,
      );

      const button = container.querySelector('va-button');

      // Click submit (print is default)
      button.click();

      await waitFor(() => {
        expect(onDownloadSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      const { container } = renderComponent();
      const heading = container.querySelector('h2#print-download-heading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal(
        'Print or download your medications list',
      );
    });

    it('should have label on select', () => {
      const { container } = renderComponent();
      const select = container.querySelector('va-select');
      expect(select.getAttribute('label')).to.equal(
        'Print or download options',
      );
    });

    it('should have hint text on select', () => {
      const { container } = renderComponent();
      const select = container.querySelector('va-select');
      expect(select.getAttribute('hint')).to.equal(
        'Choose an option and select Submit',
      );
    });

    it('should have bold text for public computer warning', () => {
      const { container } = renderComponent();
      const strongText = container.querySelector(
        'va-alert[status="warning"] strong',
      );
      expect(strongText).to.exist;
      expect(strongText.textContent).to.include(
        'If you’re on a public or shared computer,',
      );
    });
  });

  describe('content', () => {
    it('should display description text', () => {
      const { getByText } = renderComponent();
      expect(
        getByText(
          'Print or save a copy of this filtered and sorted medications list.',
        ),
      ).to.exist;
    });

    it('should display warning about public computers', () => {
      const { getByText } = renderComponent();
      expect(
        getByText(/remember that downloading saves a copy of your records/),
      ).to.exist;
    });
  });
});
