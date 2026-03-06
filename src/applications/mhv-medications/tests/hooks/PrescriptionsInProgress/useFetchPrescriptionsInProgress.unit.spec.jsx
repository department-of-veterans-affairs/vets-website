import { expect } from 'chai';
import { waitFor, cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as sinon from 'sinon';
import * as prescriptionsApiModule from '../../../api/prescriptionsApi';
import { useFetchPrescriptionsInProgress } from '../../../hooks/PrescriptionsInProgress/useFetchPrescriptionsInProgress';
import { dispStatusObj } from '../../../util/constants';

/**
 * Helper to create a date string relative to today
 * @param {number} daysAgo - Number of days ago (positive) or in the future (negative)
 * @returns {string} ISO date string
 */
const getRelativeDate = daysAgo => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

/**
 * Creates a mock prescription object
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock prescription
 */
const createMockPrescription = (overrides = {}) => ({
  prescriptionId: Math.floor(Math.random() * 10000),
  prescriptionName: 'TEST MEDICATION 100MG TAB',
  dispStatus: dispStatusObj.active,
  trackingList: [],
  ...overrides,
});

const getMockQueryResponse = (overrides = {}) => ({
  data: { prescriptions: [] },
  error: undefined,
  isLoading: false,
  isFetching: false,
  ...overrides,
});

describe('useFetchPrescriptionsInProgress', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  it('returns empty arrays when there is no prescriptions data', async () => {
    sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns(getMockQueryResponse({ data: undefined }));

    const { result } = renderHook(() => useFetchPrescriptionsInProgress());

    await waitFor(() => {
      expect(result.current.inProgress).to.deep.equal([]);
      expect(result.current.shipped).to.deep.equal([]);
      expect(result.current.submitted).to.deep.equal([]);
      expect(result.current.tooEarly).to.deep.equal([]);
      expect(result.current.prescriptionsApiError).to.be.undefined;
      expect(result.current.isLoading).to.be.false;
    });
  });

  it('returns empty arrays when prescriptions array is empty', async () => {
    sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns(getMockQueryResponse({ data: { prescriptions: [] } }));

    const { result } = renderHook(() => useFetchPrescriptionsInProgress());

    await waitFor(() => {
      expect(result.current.inProgress).to.deep.equal([]);
      expect(result.current.shipped).to.deep.equal([]);
      expect(result.current.submitted).to.deep.equal([]);
      expect(result.current.tooEarly).to.deep.equal([]);
    });
  });

  describe('loading states', () => {
    it('returns isLoading = true when isLoading is true', async () => {
      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse({ isLoading: true }));

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.isLoading).to.be.true;
      });
    });

    it('returns isLoading = true when isFetching is true', async () => {
      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse({ isFetching: true }));

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.isLoading).to.be.true;
      });
    });

    it('returns isLoading = false when neither isLoading nor isFetching', async () => {
      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse({ isLoading: false, isFetching: false }));

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.isLoading).to.be.false;
      });
    });
  });

  describe('error handling', () => {
    it('returns error when API call fails', async () => {
      const mockError = { status: 500, message: 'Server error' };
      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse({ error: mockError }));

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.prescriptionsApiError).to.deep.equal(mockError);
      });
    });
  });

  describe('prescription status filtering', () => {
    it('correctly categorizes prescriptions with different statuses', async () => {
      const mixedPrescriptions = [
        createMockPrescription({
          prescriptionId: 1,
          dispStatus: dispStatusObj.submitted,
        }),
        createMockPrescription({
          prescriptionId: 2,
          dispStatus: dispStatusObj.refillinprocess,
        }),
        createMockPrescription({
          prescriptionId: 3,
          dispStatus: dispStatusObj.active,
          trackingList: [
            {
              completeDateTime: getRelativeDate(3),
              trackingNumber: '123456789',
            },
          ],
        }),
        createMockPrescription({
          prescriptionId: 4,
          dispStatus: dispStatusObj.expired,
        }),
        createMockPrescription({
          prescriptionId: 5,
          dispStatus: dispStatusObj.discontinued,
        }),
      ];

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions: mixedPrescriptions },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.submitted).to.have.lengthOf(1);
        expect(result.current.submitted[0].prescriptionId).to.equal(1);

        expect(result.current.inProgress).to.have.lengthOf(1);
        expect(result.current.inProgress[0].prescriptionId).to.equal(2);

        expect(result.current.shipped).to.have.lengthOf(1);
        expect(result.current.shipped[0].prescriptionId).to.equal(3);

        // Expired and discontinued should not be in any category
        expect(result.current.tooEarly).to.deep.equal([]);
      });
    });

    it('ignores prescriptions with other statuses', async () => {
      const otherStatusPrescriptions = [
        createMockPrescription({
          prescriptionId: 1,
          dispStatus: dispStatusObj.expired,
        }),
        createMockPrescription({
          prescriptionId: 2,
          dispStatus: dispStatusObj.discontinued,
        }),
        createMockPrescription({
          prescriptionId: 3,
          dispStatus: dispStatusObj.transferred,
        }),
        createMockPrescription({
          prescriptionId: 4,
          dispStatus: dispStatusObj.onHold,
        }),
        createMockPrescription({
          prescriptionId: 5,
          dispStatus: dispStatusObj.unknown,
        }),
      ];

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions: otherStatusPrescriptions },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.submitted).to.deep.equal([]);
        expect(result.current.inProgress).to.deep.equal([]);
        expect(result.current.shipped).to.deep.equal([]);
        expect(result.current.tooEarly).to.deep.equal([]);
      });
    });
  });

  describe('shipped prescriptions filtering', () => {
    it('categorizes active prescriptions with recent tracking as shipped', async () => {
      const shippedPrescription = createMockPrescription({
        prescriptionId: 1,
        dispStatus: dispStatusObj.active,
        trackingList: [
          {
            completeDateTime: getRelativeDate(5),
            trackingNumber: '123456789',
          },
        ],
      });

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions: [shippedPrescription] },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.shipped).to.have.lengthOf(1);
        expect(result.current.shipped[0].prescriptionId).to.equal(1);
        expect(result.current.inProgress).to.deep.equal([]);
        expect(result.current.submitted).to.deep.equal([]);
      });
    });

    it('includes shipped prescription when tracking is recent', async () => {
      const shippedPrescription = createMockPrescription({
        prescriptionId: 1,
        dispStatus: dispStatusObj.active,
        trackingList: [
          {
            completeDateTime: getRelativeDate(13),
            trackingNumber: '123456789',
          },
        ],
      });

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions: [shippedPrescription] },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.shipped).to.have.lengthOf(1);
      });
    });

    it('excludes active prescription when tracking is outdated', async () => {
      const oldShippedPrescription = createMockPrescription({
        prescriptionId: 1,
        dispStatus: dispStatusObj.active,
        trackingList: [
          {
            completeDateTime: getRelativeDate(20),
            trackingNumber: '123456789',
          },
        ],
      });

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions: [oldShippedPrescription] },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.shipped).to.deep.equal([]);
      });
    });

    it('excludes active prescription without tracking completeDateTime', async () => {
      const noTrackingPrescription = createMockPrescription({
        prescriptionId: 1,
        dispStatus: dispStatusObj.active,
        trackingList: [
          {
            trackingNumber: '123456789',
            // no completeDateTime
          },
        ],
      });

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions: [noTrackingPrescription] },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.shipped).to.deep.equal([]);
      });
    });

    it('excludes active prescription with empty tracking list', async () => {
      const emptyTrackingPrescription = createMockPrescription({
        prescriptionId: 1,
        dispStatus: dispStatusObj.active,
        trackingList: [],
      });

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions: [emptyTrackingPrescription] },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.shipped).to.deep.equal([]);
      });
    });

    it('excludes active prescription without trackingList property', async () => {
      const noTrackingListPrescription = createMockPrescription({
        prescriptionId: 1,
        dispStatus: dispStatusObj.active,
      });
      delete noTrackingListPrescription.trackingList;

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions: [noTrackingListPrescription] },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        expect(result.current.shipped).to.deep.equal([]);
      });
    });

    it('uses only the first tracking entry for shipped determination', async () => {
      const multipleTrackingPrescription = createMockPrescription({
        prescriptionId: 1,
        dispStatus: dispStatusObj.active,
        trackingList: [
          {
            completeDateTime: getRelativeDate(20),
            trackingNumber: '111111111',
          },
          {
            completeDateTime: getRelativeDate(5),
            trackingNumber: '222222222',
          },
        ],
      });

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions: [multipleTrackingPrescription] },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        // Should NOT be in shipped because the first tracking entry is older than 14 days
        expect(result.current.shipped).to.deep.equal([]);
      });
    });
  });

  describe('tooEarly array (not implemented yet)', () => {
    it('always returns empty tooEarly array', async () => {
      const prescriptions = [
        createMockPrescription({
          prescriptionId: 1,
          dispStatus: dispStatusObj.submitted,
        }),
        createMockPrescription({
          prescriptionId: 2,
          dispStatus: dispStatusObj.refillinprocess,
        }),
      ];

      sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(
          getMockQueryResponse({
            data: { prescriptions },
          }),
        );

      const { result } = renderHook(() => useFetchPrescriptionsInProgress());

      await waitFor(() => {
        // tooEarly logic is not implemented yet per the TODO in the hook
        expect(result.current.tooEarly).to.deep.equal([]);
      });
    });
  });
});
