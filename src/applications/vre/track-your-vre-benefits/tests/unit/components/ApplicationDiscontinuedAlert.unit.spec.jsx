import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import ApplicationDiscontinuedAlert from '../../../components/ApplicationDiscontinuedAlert';

const makeStore = (state = {}, dispatchFn = () => {}) => ({
  getState: () => state,
  subscribe: () => () => {},
  dispatch: dispatchFn,
});

const renderWithStore = (ui, state, dispatchFn) =>
  render(<Provider store={makeStore(state, dispatchFn)}>{ui}</Provider>);

describe('ApplicationDiscontinuedAlert', () => {
  it('renders va-alert with error status and visible', () => {
    const { container } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');
    expect(alert.hasAttribute('visible')).to.be.true;
  });

  it('renders default reason fallback', () => {
    const { getByText } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    expect(getByText(/no reason provided\./i)).to.exist;
  });

  it('renders provided discontinued reason when passed', () => {
    const reason = '079 - Plan Developed/Redeveloped';
    const { getByText } = renderWithStore(
      <ApplicationDiscontinuedAlert discontinuedReason={reason} />,
      { ch31PdfLetterDownload: { loading: false, error: null } },
    );

    expect(getByText(reason)).to.exist;
  });

  it('renders loading indicator when downloading', () => {
    const { container } = renderWithStore(<ApplicationDiscontinuedAlert />, {
      ch31PdfLetterDownload: { loading: true, error: null },
    });

    // Shadow DOM: query va-loading-indicator
    const vaLoading = container.querySelector('va-loading-indicator');
    expect(vaLoading).to.exist;
  });

  it('renders error message when download returns 404', () => {
    const { getByText, container } = renderWithStore(
      <ApplicationDiscontinuedAlert />,
      {
        ch31PdfLetterDownload: { loading: false, error: { status: 404 } },
      },
    );

    expect(
      getByText(
        'Letter not found. Contact your counselor for additional information.',
      ),
    ).to.exist;

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.not.exist;
  });

  it('renders generic error message when download fails with other error', () => {
    const { getByText, container } = renderWithStore(
      <ApplicationDiscontinuedAlert />,
      {
        ch31PdfLetterDownload: { loading: false, error: { status: 500 } },
      },
    );

    expect(
      getByText(
        "We can't download your letter right now. Please try again later.",
      ),
    ).to.exist;

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.not.exist;
  });

  it('dispatches download action when the letter download link is clicked', () => {
    const dispatchSpy = sinon.spy();
    const resCaseId = 12345;
    const { container } = renderWithStore(
      <ApplicationDiscontinuedAlert resCaseId={resCaseId} />,
      { ch31PdfLetterDownload: { loading: false, error: null } },
      dispatchSpy,
    );

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;
    expect(vaLink.getAttribute('text')).to.equal(
      'Download the VR-58 CH31 Adverse Action Decision Letter',
    );
    expect(vaLink.getAttribute('filetype')).to.equal('PDF');
    expect(vaLink.hasAttribute('download')).to.be.true;
    fireEvent.click(vaLink);

    expect(dispatchSpy.calledOnce).to.be.true;
    expect(typeof dispatchSpy.firstCall.args[0]).to.equal('function');
  });

  it('does not dispatch download action when already downloading', () => {
    const dispatchSpy = sinon.spy();
    const { container } = renderWithStore(
      <ApplicationDiscontinuedAlert resCaseId={12345} />,
      { ch31PdfLetterDownload: { loading: true, error: null } },
      dispatchSpy,
    );

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.not.exist;
    expect(dispatchSpy.notCalled).to.be.true;
  });
});
