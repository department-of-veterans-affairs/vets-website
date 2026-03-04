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

    expect(container.querySelector('va-loading-indicator')).to.exist;
  });
});
