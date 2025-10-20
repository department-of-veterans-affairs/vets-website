import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import * as uniqueUserMetrics from '~/platform/mhv/unique_user_metrics';
import reducer from '../../reducers';
import * as allergiesApiModule from '../../api/allergiesApi';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';
import { stubAllergiesApi, stubPrescriptionsListApi } from '../testing-utils';
import Prescriptions from '../../containers/Prescriptions';
import emptyPrescriptionsList from '../e2e/fixtures/empty-prescriptions-list.json';
import { MEDS_BY_MAIL_FACILITY_ID } from '../../util/constants';

let sandbox;
let logUniqueUserMetricsEventsStub;

describe('Medications Prescriptions container', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    logUniqueUserMetricsEventsStub = sandbox.stub(
      uniqueUserMetrics,
      'logUniqueUserMetricsEvents',
    );
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

  it('should log prescriptions accessed event when prescriptions are successfully loaded', async () => {
    const screen = setup();

    // Wait for the medications list to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('med-list')).to.exist;
    });

    await waitFor(() => {
      expect(
        logUniqueUserMetricsEventsStub.calledWith(
          uniqueUserMetrics.EVENT_REGISTRY.PRESCRIPTIONS_ACCESSED,
        ),
      ).to.be.true;
    });
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
    await screen.getByTestId('Title-Notes');
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

  it('displays text inside refill box "find a list of prescriptions you can refill online."', async () => {
    const screen = setup(initialState);
    expect(
      screen.findByText('find a list of prescriptions you can refill online..'),
    );
  });

  it('Simulates print button click', async () => {
    if (!window.print) {
      window.print = () => {};
    }
    const printStub = sinon.stub(window, 'print');
    const screen = setup();
    const button = await screen.findByTestId('download-print-button');
    expect(button).to.exist;
    expect(button).to.have.text('Print');
    fireEvent.click(button);
    await waitFor(() => {
      fireEvent.click(button);
    });
    printStub.restore();
  });

  it('displays link for allergies if mhv_medications_display_allergies feature flag is set to true', async () => {
    const screen = setup({
      ...initialState,
    });
    expect(screen.getByText('Go to your allergies and reactions')).to.exist;
  });

  it('displays filter accordion', async () => {
    const screen = setup();
    expect(await screen.getByTestId('filter-accordion')).to.exist;
  });

  it('displays Meds by Mail content for Meds by Mail users', async () => {
    const screen = setup({
      ...initialState,
      user: {
        profile: {
          userFullName: { first: 'test', last: 'last', suffix: 'jr' },
          dob: '2000-01-01',
          facilities: [{ facilityId: MEDS_BY_MAIL_FACILITY_ID }],
        },
      },
    });

    expect(
      screen.queryByText(
        /If you use Meds by Mail, you can also call your servicing center and ask them to update your records\./,
        {
          selector: 'p',
        },
      ),
    ).not.to.exist;

    expect(screen.getByTestId('meds-by-mail-header')).to.exist;
    expect(screen.getByTestId('meds-by-mail-top-level-text')).to.exist;
    expect(screen.getByTestId('meds-by-mail-additional-info')).to.exist;
  });

  it('does not display Meds by Mail content for non-Meds by Mail users', async () => {
    const screen = setup();

    expect(
      screen.getByText(
        /If you use Meds by Mail, you can also call your servicing center and ask them to update your records\./,
        {
          selector: 'p',
        },
      ),
    ).to.exist;

    expect(screen.queryByTestId('meds-by-mail-header')).not.to.exist;
    expect(screen.queryByTestId('meds-by-mail-top-level-text')).not.to.exist;
    expect(screen.queryByTestId('meds-by-mail-additional-info')).not.to.exist;
  });
});
