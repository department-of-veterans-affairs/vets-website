import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import ApplicationInterruptedAlert from '../../../components/ApplicationInterruptedAlert';

const makeStore = (state = {}) => ({
  getState: () => state,
  subscribe: () => () => {},
  dispatch: () => {},
});

const renderWithStore = (ui, state) =>
  render(<Provider store={makeStore(state)}>{ui}</Provider>);

describe('ApplicationInterruptedAlert', () => {
  it('renders va-alert with error status and visible', () => {
    const { container } = renderWithStore(<ApplicationInterruptedAlert />, {
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
    const { container } = renderWithStore(<ApplicationInterruptedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    const headline = container.querySelector('va-alert h3[slot="headline"]');
    expect(headline).to.exist;
    expect(headline.textContent).to.match(
      /sorry, your vr&e chapter 31 benefits have been interrupted/i,
    );
  });

  it('renders explanatory text and default reason fallback', () => {
    const { getByText } = renderWithStore(<ApplicationInterruptedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    expect(
      getByText(
        /your vr&e chapter 31 benefits have been interrupted for the following reasons:/i,
      ),
    ).to.exist;

    expect(getByText(/no reason provided\./i)).to.exist;
  });

  it('renders provided interrupted reason when passed', () => {
    const reason = 'You did not complete required counseling sessions.';
    const { getByText, queryByText } = renderWithStore(
      <ApplicationInterruptedAlert interruptedReason={reason} />,
      { ch31PdfLetterDownload: { loading: false, error: null } },
    );

    expect(getByText(reason)).to.exist;
    expect(queryByText(/no reason provided\./i)).to.be.null;
  });

  it('applies layout classes on outer container', () => {
    const { container } = renderWithStore(<ApplicationInterruptedAlert />, {
      ch31PdfLetterDownload: { loading: false, error: null },
    });

    const wrapper = container.querySelector('div');
    expect(wrapper).to.exist;
    expect(wrapper.classList.contains('vads-u-margin-y--3')).to.be.true;
  });
});
