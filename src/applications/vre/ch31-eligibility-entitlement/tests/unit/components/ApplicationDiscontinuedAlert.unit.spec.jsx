import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import ApplicationDiscontinuedAlert from '../../../components/ApplicationDiscontinuedAlert';

const makeStore = (state = {}) => ({
  getState: () => state,
  subscribe: () => () => {},
  dispatch: () => {},
});

const renderWithStore = (ui, state) =>
  render(<Provider store={makeStore(state)}>{ui}</Provider>);

describe('ApplicationDiscontinuedAlert', () => {
  it('renders va-alert with error status and visible', () => {
    const { container } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');
    expect(alert.hasAttribute('visible')).to.be.true;
    expect(alert.getAttribute('close-btn-aria-label')).to.equal(
      'Close notification',
    );
  });

  it('renders headline inside va-alert', () => {
    const { container } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    const headline = container.querySelector('va-alert h3[slot="headline"]');
    expect(headline).to.exist;
    expect(headline.textContent).to.match(
      /processing your chapter 31 claim has been discontinued/i,
    );
  });

  it('renders explanatory text and default reason fallback', () => {
    const { getByText } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    expect(
      getByText(
        /your vr&e chapter 31 claim has been discontinued for the following reasons:/i,
      ),
    ).to.exist;
    expect(getByText(/no reason provided\./i)).to.exist;
  });

  it('renders provided discontinued reason when passed', () => {
    const reason = '079 - Plan Developed/Redeveloped';
    const { getByText, queryByText } = renderWithStore(
      <ApplicationDiscontinuedAlert discontinuedReason={reason} />,
      { ch31PdfLetterDownload: { loading: false, error: null } },
    );

    expect(getByText(reason)).to.exist;
    expect(queryByText(/no reason provided\./i)).to.be.null;
  });

  it('renders "View my letter" link when not downloading', () => {
    const { container } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('#');
    expect(link.getAttribute('type')).to.equal('primary');
    expect(link.getAttribute('text')).to.equal('View my letter');
  });

  it('renders loading indicator when downloading', () => {
    const { container } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: { loading: true, error: null },
    });

    const loader = container.querySelector('va-loading-indicator');
    expect(loader).to.exist;
    expect(loader.getAttribute('message')).to.equal(
      'Downloading your letter...',
    );
  });

  it('renders download error message when present', () => {
    const { getByText } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: {
        loading: false,
        error: { status: 500, messages: ['Server error'] },
      },
    });

    expect(getByText(/we can't download your letter right now/i)).to.exist;
  });

  it('applies layout classes on outer container', () => {
    const { container } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    const wrapper = container.querySelector('div');
    expect(wrapper).to.exist;
    expect(wrapper.classList.contains('vads-u-margin-y--3')).to.be.true;
  });
});
