import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import * as allergiesApiModule from '../../api/allergiesApi';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';
import { stubAllergiesApi, stubPrescriptionsListApi } from '../testing-utils';
import Prescriptions from '../../containers/Prescriptions';
import emptyPrescriptionsList from '../e2e/fixtures/empty-prescriptions-list.json';

let sandbox;

describe('Medications Prescriptions container', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsListApi({ sandbox });
  });

  afterEach(() => {
    sandbox.restore();
  });

  const initialState = {
    rx: {},
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouterV6(<Prescriptions />, {
      initialState: state,
      reducers: reducer,
      additionalMiddlewares: [
        allergiesApiModule.allergiesApi.middleware,
        prescriptionsApiModule.prescriptionsApi.middleware,
      ],
    });
  };

  it('renders without errors', async () => {
    const screen = setup();
    expect(screen);
  });

  it('should display loading message when loading prescriptions', async () => {
    const screen = setup();
    waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).to.exist;
      expect(screen.getByText('Loading your medications...')).to.exist;
    });
  });

  it('displays intro text ', async () => {
    const screen = setup();
    expect(await screen.getByTestId('Title-Notes').textContent).to.contain(
      'When you share your medications list with providers, make sure you also tell them about your allergies and reactions to medications',
    );
  });

  it('shows title ', async () => {
    const screen = setup();
    expect(await screen.findByTestId('list-page-title')).to.exist;
  });

  it('displays empty list alert', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsListApi({
      sandbox,
      data: {
        prescriptions: emptyPrescriptionsList.data,
        meta: emptyPrescriptionsList.meta,
        pagination: emptyPrescriptionsList.meta.pagination,
      },
    });
    const screen = setup();
    expect(
      screen.getByText(
        'You don’t have any VA prescriptions or medication records',
      ),
    ).to.exist;
  });

  it('should display a clickable download button', async () => {
    const screen = setup();
    const pdfButton = screen.getByTestId('download-pdf-button');
    await waitFor(() => {
      fireEvent.click(pdfButton);
    });
    expect(screen);
  });

  it('should show the allergy error alert when downloading PDF', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, error: true });
    stubPrescriptionsListApi({ sandbox });
    const screen = setup();
    const pdfButton = screen.getByTestId('download-pdf-button');
    await waitFor(() => {
      fireEvent.click(pdfButton);
    });
    expect(screen);
    waitFor(() => {
      expect(screen.getByText('We can’t download your records right now')).to
        .exist;
    });
  });

  it('should show the allergy error alert when printing', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, error: true });
    stubPrescriptionsListApi({ sandbox });
    const screen = setup();
    const pdfButton = screen.getByTestId('download-print-button');

    await waitFor(() => {
      fireEvent.click(pdfButton);
    });
    expect(screen);
    waitFor(() => {
      expect(screen.getByText('We can’t print your records right now')).to
        .exist;
    });
  });

  it('should show the allergy error alert when printing all meds', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, error: true });
    stubPrescriptionsListApi({ sandbox });
    const screen = setup();
    const pdfButton = screen.getByTestId('download-print-all-button');
    await waitFor(() => {
      fireEvent.click(pdfButton);
    });
    expect(screen);
    waitFor(() => {
      expect(screen.getByText('We can’t print your records right now')).to
        .exist;
    });
  });

  it('should show the allergy error alert when downloading txt', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, error: true });
    stubPrescriptionsListApi({ sandbox });
    const screen = setup();
    const pdfButton = screen.getByTestId('download-txt-button');
    await waitFor(() => {
      fireEvent.click(pdfButton);
    });
    expect(screen);
    waitFor(() => {
      expect(screen.getByText('We can’t download your records right now')).to
        .exist;
    });
  });

  it('displays text inside refill box "find a list of prescriptions you can refill online." when refill flag is true', async () => {
    const screen = setup({
      ...initialState,
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_refill_content: true,
      },
    });
    expect(
      screen.findByText('find a list of prescriptions you can refill online..'),
    );
  });

  it('Simulates print all button click', async () => {
    const screen = setup();
    const button = await screen.findByTestId('download-print-all-button');
    expect(button).to.exist;
    expect(button).to.have.text('Print all medications');
    await waitFor(() => {
      button.click();
    });
  });

  it('Simulates print button click', async () => {
    if (!window.print) {
      window.print = () => {};
    }
    const printStub = sinon.stub(window, 'print');
    const screen = setup();
    const button = await screen.findByTestId('download-print-button');
    expect(button).to.exist;
    expect(button).to.have.text('Print this page of the list');
    fireEvent.click(button);
    await waitFor(() => {
      fireEvent.click(button);
    });
    printStub.restore();
  });

  it('displays link for allergies if mhv_medications_display_allergies feature flag is set to true', async () => {
    const screen = setup({
      ...initialState,
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_allergies: true,
      },
    });
    expect(screen.getByText('Go to your allergies and reactions')).to.exist;
  });

  it('displays "If you print or download this list, we\'ll include a list of your allergies." if mhv_medications_display_allergies feature flag is set to false', async () => {
    const screen = setup({
      ...initialState,
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_allergies: false,
      },
    });
    expect(await screen.getByTestId('Title-Notes').textContent).to.contain(
      'When you share your medications list with providers, make sure you also tell them about your allergies and reactions to medications. If you print or download this list, we’ll include a list of your allergies.',
    );
  });
  it('displays filter accordion', async () => {
    const screen = setup();
    expect(await screen.getByTestId('filter-accordion')).to.exist;
  });
});
