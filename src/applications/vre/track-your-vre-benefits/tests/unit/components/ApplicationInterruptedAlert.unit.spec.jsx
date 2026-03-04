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
  });

  it('renders provided interrupted reason when passed', () => {
    const reason = 'You did not complete required counseling sessions.';
    const { getByText } = renderWithStore(
      <ApplicationInterruptedAlert interruptedReason={reason} />,
      { ch31PdfLetterDownload: { loading: false, error: null } },
    );

    expect(getByText(reason)).to.exist;
  });
});
