import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import * as allergiesApiModule from '../../api/allergiesApi';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';
import { stubAllergiesApi } from '../testing-utils';
import RefillPrescriptions from '../../containers/RefillPrescriptions';
import reducer from '../../reducers';
import { dateFormat } from '../../util/helpers';

const refillablePrescriptions = require('../fixtures/refillablePrescriptionsList.json');

let sandbox;

const initMockApis = ({
  sinonSandbox,
  prescriptions = refillablePrescriptions,
  isLoading = false,
}) => {
  stubAllergiesApi({ sandbox });

  sinonSandbox
    .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
    .returns({
      data: { prescriptions, meta: {} },
      error: false,
      isLoading,
      isFetching: false,
    });

  sinonSandbox
    .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
    .returns([
      sinon.stub().resolves({ data: { successfulIds: [], failedIds: [] } }),
      { isLoading: false, error: null },
    ]);
};

describe('Refill Prescriptions Component', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    initMockApis({ sinonSandbox: sandbox });
  });

  afterEach(() => {
    sandbox.restore();
  });

  const initialState = {
    rx: {
      prescriptions: {
        selectedSortOption: 'alphabeticallyByStatus',
      },
      breadcrumbs: {
        list: [
          {
            url: '/my-health/medications/about',
            label: 'About medications',
          },
        ],
      },
    },
    featureToggles: {},
    user: {
      login: {
        currentlyLoggedIn: true,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouterV6(<RefillPrescriptions />, {
      initialState: state,
      reducers: reducer,
      initialEntries: ['/refill'],
      additionalMiddlewares: [
        allergiesApiModule.allergiesApi.middleware,
        prescriptionsApiModule.prescriptionsApi.middleware,
      ],
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should render loading state', async () => {
    sandbox.restore();
    initMockApis({ sinonSandbox: sandbox, isLoading: true });
    const screen = setup();
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('Shows 404 page if feature toggle is disabled', async () => {
    const screen = setup({
      ...initialState,
      featureToggles: {},
      rx: {
        ...initialState.rx,
        prescriptions: {
          ...initialState.rx.prescriptions,
        },
      },
    });
    expect(screen.findByTestId('mhv-page-not-found')).to.exist;
  });

  it('Mocks API Request', async () => {
    const screen = setup();
    const title = await screen.findByTestId('refill-page-title');
    expect(title).to.exist;
  });

  it('Shows h1 and h2', async () => {
    const screen = setup();
    const title = await screen.findByTestId('refill-page-title');
    expect(title).to.exist;
    expect(title).to.have.text('Refill prescriptions');
    const heading = await screen.findByRole('heading', {
      level: 2,
      name: /Ready to refill/i,
    });
    expect(heading).to.exist;
    expect(heading.tagName).to.equal('H2');
  });

  it('Shows the request refill button', async () => {
    const screen = setup();
    const button = await screen.findByTestId('request-refill-button');
    expect(button).to.exist;
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    expect(checkbox).to.exist;
    expect(checkbox).to.have.property('label', `ATORVASTATIN 40MG TAB`);
    // click checkbox
    checkbox.__events.vaChange({
      detail: { checked: true },
    });
    expect(button).to.have.property('text', 'Request 1 refill');
    button.click();
  });

  it('Shows the select all checkbox', async () => {
    const screen = setup();
    const button = await screen.findByTestId('request-refill-button');
    expect(button).to.exist;
    const checkbox = await screen.findByTestId('select-all-checkbox');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.property('label', `Select all 9 refills`);
    // click checkbox
    checkbox.__events.vaChange({
      detail: { checked: true },
    });
    expect(button).to.have.property('text', 'Request 9 refills');
  });

  it('Shows the correct "last filled on" date for refill', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    expect(lastFilledEl).to.exist;
    expect(lastFilledEl)
      .to.have.property('checkbox-description')
      .that.includes(
        refillablePrescriptions[0].dispensedDate
          ? `Last filled on ${dateFormat(
              refillablePrescriptions[0].dispensedDate,
            )}`
          : 'Not filled yet',
      );
  });

  it('Shows the correct "last filled on" date (w/rxRfRecords) for refill', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId(
      `refill-prescription-checkbox-7`,
    );
    expect(lastFilledEl).to.exist;
    const rx = refillablePrescriptions.find(
      ({ prescriptionId }) => prescriptionId === 22217099,
    );
    expect(lastFilledEl)
      .to.have.property('checkbox-description')
      .that.includes(
        `Last filled on ${dateFormat(rx.rxRfRecords[0]?.dispensedDate)}`,
      );
  });

  it('Checks the checkbox for first prescription', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
  });

  it('Unchecks the checkbox for first prescription', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
    checkbox.click();
  });

  it('Shows the correct text for one prescription', async () => {
    sandbox.restore();
    initMockApis({
      sinonSandbox: sandbox,
      prescriptions: [refillablePrescriptions[0]],
    });
    const screen = setup();
    const checkboxGroup = await screen.findByTestId('refill-checkbox-group');
    expect(checkboxGroup.label).to.equal(
      'You have 1 prescription ready to refill.',
    );
  });

  it('Completes api request with selected prescriptions', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
    const button = await screen.findByTestId('request-refill-button');
    button.click();
  });

  it('Checks for error message when refilling with 0 meds selected and 1 available', async () => {
    sandbox.restore();
    initMockApis({
      sinonSandbox: sandbox,
      prescriptions: [refillablePrescriptions[0]],
    });
    const screen = setup();

    const button = await screen.findByTestId('request-refill-button');
    const checkboxGroup = await screen.findByTestId('refill-checkbox-group');
    expect(checkboxGroup).to.exist;
    expect(checkboxGroup.error).to.equal('');
    button.click();
    expect(checkboxGroup.error).to.equal(
      'Select at least one prescription to refill',
    );
    await waitFor(() => {
      const focusEl = document.activeElement;
      expect(focusEl).to.have.property(
        'id',
        `checkbox-${refillablePrescriptions[0].prescriptionId}`,
      );
    });
  });

  it('Checks for error message when refilling with 0 meds selected and many available', async () => {
    const screen = setup();
    const button = await screen.findByTestId('request-refill-button');
    const checkboxGroup = await screen.findByTestId('refill-checkbox-group');
    expect(button).to.exist;
    expect(checkboxGroup).to.exist;
    expect(checkboxGroup.error).to.equal('');
    button.click();
    expect(checkboxGroup.error).to.equal(
      'Select at least one prescription to refill',
    );
    await waitFor(() => {
      const focusEl = document.activeElement;
      expect(focusEl).to.have.property('id', 'select-all-checkbox');
    });
  });

  it('Shows h1 and note if no prescriptions are refillable', async () => {
    sandbox.restore();
    initMockApis({
      sinonSandbox: sandbox,
      prescriptions: [],
    });
    const screen = setup();
    const title = await screen.findByTestId('refill-page-title');
    expect(title).to.exist;
    expect(title).to.have.text('Refill prescriptions');
    expect(screen.getByTestId('no-refills-message')).to.exist;
  });
});
