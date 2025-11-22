import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import AfterVisitSummary from './AfterVisitSummary';

describe('VAOS Component: AfterVisitSummary', () => {
  const initialState = {};
  let sandbox;
  let originalAtob;
  let originalCreateObjectURL;
  let originalRevokeObjectURL;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    originalAtob = global.atob;
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
  });

  afterEach(() => {
    // Restore globals if we stubbed them
    if (originalAtob) {
      global.atob = originalAtob;
    } else {
      delete global.atob;
    }
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    sandbox.restore();
  });

  it('should display after visit summary link', async () => {
    // Arrange
    const appointment = {
      avsPath: '/test-avs-path',
    };

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByTestId('after-vist-summary-link')).to.exist;
  });

  it('Should display after visit summary link error message', async () => {
    // Arrange
    const appointment = {
      avsError: 'Error retrieving AVS info',
    };

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      {
        initialState,
      },
    );

    await screen.findByRole('heading', {
      name: /We can't access after-visit summaries at this time./i,
    });
  });

  it('Should record google analytics when after visit summary link is clicked ', () => {
    // Arrange
    const appointment = {
      avsPath: '/test-avs-path',
    };

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByTestId('after-vist-summary-link')).to.exist;

    userEvent.click(screen.queryByTestId('after-vist-summary-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-after-visit-summary-link-clicked',
    });
  });

  it('Should display after visit summary link unavailable message', async () => {
    // Arrange
    const appointment = {};

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      {
        initialState,
      },
    );

    // Assert
    expect(
      screen.getByText(
        'An after-visit summary is not available at this time.',
        {
          exact: true,
          selector: 'p',
        },
      ),
    );
  });

  it('should render PDF link when a valid ambulatory summary PDF is provided', async () => {
    sandbox.stub(URL, 'createObjectURL').returns('blob:pdf');
    sandbox.stub(URL, 'revokeObjectURL');
    sandbox.stub(global, 'atob').returns('%PDF-1.4\nMOCK');
    const appointment = {
      avsPdf: [
        {
          id: '1',
          name: 'Ambulatory Visit Summary',
          noteType: 'ambulatory_patient_summary',
          contentType: 'application/pdf',
          binary: 'JVBERi0xLjQK',
        },
      ],
    };

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      { initialState },
    );

    expect(screen.getByTestId('after-visit-summary-pdf-1')).to.exist;
  });

  it('should show unavailable message when only invalid AVS PDFs are provided', async () => {
    const appointment = {
      avsPdf: [
        {
          id: 'bad',
          name: 'Broken',
          noteType: 'ambulatory_patient_summary',
          contentType: 'application/pdf',
          binary: 'JVBERi0xLjQKJeLjz9M#INVALID-DATA$$%%123==',
        },
      ],
    };

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      { initialState },
    );

    expect(
      screen.getByText(
        'An after-visit summary is not available at this time.',
        {
          exact: true,
          selector: 'p',
        },
      ),
    ).to.exist;
  });
});
