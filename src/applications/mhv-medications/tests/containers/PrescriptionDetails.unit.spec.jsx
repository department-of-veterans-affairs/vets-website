import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  mockApiRequest,
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import PrescriptionDetails from '../../containers/PrescriptionDetails';
import rxDetailsResponse from '../fixtures/prescriptionDetails.json';
import nonVaRxResponse from '../fixtures/nonVaPrescription.json';
import { dateFormat } from '../../util/helpers';

const allergyErrorState = {
  initialState: {
    rx: {
      prescriptions: {
        prescriptionDetails: rxDetailsResponse.data.attributes,
      },
      allergies: { error: true },
    },
  },
  reducers: reducer,
  path: '/',
};

describe('Prescription details container', () => {
  const initialState = {
    rx: {
      prescriptions: {
        prescriptionDetails: rxDetailsResponse.data.attributes,
        apiError: false,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<PrescriptionDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/1234567891',
    });
  };

  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('renders without errors', () => {
    const screen = setup({
      ...initialState,
      user: {
        profile: {
          userFullName: { first: 'test', last: 'last', suffix: 'jr' },
          dob: 'January, 01, 2000',
        },
      },
      rx: {
        prescriptions: {
          prescriptionDetails: {
            rxRfRecords: [
              {
                cmopNdcNumber: '00093314705',
              },
            ],
          },
        },
      },
    });
    expect(screen);
  });

  it('should display loading message when loading specific rx', async () => {
    const screen = setup({
      prescriptions: {
        prescriptionDetails: undefined,
      },
    });
    waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).to.exist;
      expect(screen.getByText('Loading your medication record...')).to.exist;
    });
  });

  it('should show the allergy error alert when downloading txt', () => {
    resetFetch();
    const mockData = [nonVaRxResponse];
    mockApiRequest(mockData);
    const screen = renderWithStoreAndRouter(
      <PrescriptionDetails />,
      allergyErrorState,
    );
    const pdfButton = screen.getByTestId('download-txt-button');
    fireEvent.click(pdfButton);
    expect(screen);
    waitFor(() => {
      expect(screen.getByText('We can’t download your records right now')).to
        .exist;
    });
  });

  it('should show the allergy error alert when printing', () => {
    resetFetch();
    const mockData = [nonVaRxResponse];
    mockApiRequest(mockData);
    const screen = renderWithStoreAndRouter(
      <PrescriptionDetails />,
      allergyErrorState,
    );
    const pdfButton = screen.getByTestId('download-print-button');
    fireEvent.click(pdfButton);
    expect(screen);
    waitFor(() => {
      expect(screen.getByText('We can’t print your records right now')).to
        .exist;
    });
  });

  it('displays the prescription name and filled by date', () => {
    const screen = setup();

    const rxName = screen.findByText(
      rxDetailsResponse.data.attributes.prescriptionName,
    );
    expect(screen.getByTestId('rx-last-filled-date')).to.have.text(
      `Last filled on ${dateFormat(
        rxDetailsResponse.data.attributes.dispensedDate,
        'MMMM D, YYYY',
      )}`,
    );
    expect(rxName).to.exist;
  });

  it('still shows medication details if rx data is received from api instead of redux', () => {
    resetFetch();
    const mockData = [nonVaRxResponse];
    mockApiRequest(mockData);
    const screen = renderWithStoreAndRouter(<PrescriptionDetails />, {
      initialState: {
        rx: {
          prescriptions: {
            prescriptionDetails: null,
          },
        },
      },
      reducers: reducer,
      path: '/medication/21142496',
    });
    const rxName = screen.findByText(
      nonVaRxResponse.data.attributes.orderableItem,
    );

    expect(rxName).to.exist;
  });
  it('displays "Not filled yet" when there is no dispense date', () => {
    const stateWdispensedDate = {
      ...initialState,
      rx: {
        prescriptions: {
          prescriptionDetails: {
            ...rxDetailsResponse.data.attributes,
            dispensedDate: null,
          },
        },
      },
    };
    const screen = setup(stateWdispensedDate);
    expect(screen.getByTestId('rx-last-filled-date')).to.have.text(
      'Not filled yet',
    );
  });

  it('displays "Documented on" instead of "filled by" date, when med is non VA', () => {
    const nonVaRxState = {
      rx: {
        prescriptions: {
          prescriptionDetails: nonVaRxResponse.data.attributes,
        },
      },
    };
    const screen = setup(nonVaRxState);

    expect(screen.getByTestId('rx-last-filled-date')).to.have.text(
      `Documented on ${dateFormat(
        nonVaRxResponse.data.attributes.orderedDate,
        'MMMM D, YYYY',
      )}`,
    );
  });

  it('name should use orderableItem for non va prescription if no prescriptionName is available', () => {
    const mockData = [nonVaRxResponse];
    resetFetch();
    mockApiRequest(mockData);
    const screen = renderWithStoreAndRouter(<PrescriptionDetails />, {
      initialState: {
        rx: {
          prescriptions: {
            prescriptionDetails: nonVaRxResponse.data.attributes,
          },
        },
      },
      reducers: reducer,
      path: '/21142496',
    });
    const rxName = screen.findByText(
      nonVaRxResponse.data.attributes.orderableItem,
    );

    expect(rxName).to.exist;
  });

  it('name should use prescriptionName for non va prescription if available', () => {
    const mockData = [nonVaRxResponse];
    const testPrescriptionName = 'Test Name for Non-VA prescription';
    mockData.prescriptionName = testPrescriptionName;
    resetFetch();
    mockApiRequest(mockData);
    const screen = renderWithStoreAndRouter(<PrescriptionDetails />, {
      initialState: {
        rx: {
          prescriptions: {
            prescriptionDetails: nonVaRxResponse.data.attributes,
          },
        },
      },
      reducers: reducer,
      path: '/21142496',
    });
    const rxName = screen.findByText(
      nonVaRxResponse.data.attributes.prescriptionName,
    );

    expect(rxName).to.exist;
  });
});
