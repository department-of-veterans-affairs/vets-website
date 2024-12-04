import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent } from '@testing-library/dom';
import reducer from '../../reducers';
import DownloadReportPage from '../../containers/DownloadReportPage';
import user from '../fixtures/user.json';

describe('DownloadRecordsPage', () => {
  const initialState = {
    user,
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadReportPage />, {
      initialState,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
    expect(screen.getByText('Download your medical records reports')).to.exist;
  });

  it('generates ccd on button click', () => {
    const ccdAccordion = screen.getByTestId('ccdAccordionItem');
    expect(ccdAccordion).to.exist;

    fireEvent.click(ccdAccordion);
    const ccdGenerateButton = screen.getByTestId('generateCcdButton');
    expect(ccdGenerateButton).to.exist;

    fireEvent.click(ccdGenerateButton);
    expect(screen.container.querySelector('#generating-ccd-indicator')).to
      .exist;
  });
});
