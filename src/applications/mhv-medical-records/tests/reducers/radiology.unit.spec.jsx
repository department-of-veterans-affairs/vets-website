import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { labTypes, loadStates } from '../../util/constants';
import { radiologyReducer } from '../../reducers/radiology';

describe('radiologyReducer', () => {
  it('should return the initial state', () => {
    const state = radiologyReducer(undefined, { type: 'UNKNOWN' });
    expect(state.listState).to.equal(loadStates.PRE_FETCH);
    expect(state.radiologyList).to.be.undefined;
    expect(state.updatedList).to.be.undefined;
    expect(state.radiologyDetails).to.be.undefined;
    expect(state.dateRange).to.exist;
  });

  it('should handle UPDATE_LIST_STATE', () => {
    const state = radiologyReducer(undefined, {
      type: Actions.Radiology.UPDATE_LIST_STATE,
      payload: loadStates.FETCHING,
    });
    expect(state.listState).to.equal(loadStates.FETCHING);
  });

  describe('GET_LIST', () => {
    const mockMhvRadiologyRecord = {
      id: 5621490,
      hash: 'abc123',
      radiologist: 'DOE,JOHN',
      procedureName: 'DEXA, PERIPHERAL STUDY',
      eventDate: '2004-01-06T19:27:00Z',
      status: 'Verified',
    };

    const mockCvixRadiologyRecord = {
      id: 24647611,
      hash: 'def456',
      procedureName: 'CT THORAX W/O CONT',
      performedDatePrecise: 1296052104901,
      imageCount: 213,
    };

    it('creates a list from MHV radiology records', () => {
      const newState = radiologyReducer(undefined, {
        type: Actions.Radiology.GET_LIST,
        radiologyResponse: [mockMhvRadiologyRecord],
        cvixRadiologyResponse: [],
        isCurrent: true,
      });

      expect(newState.radiologyList).to.be.an('array');
      expect(newState.radiologyList.length).to.equal(1);
      expect(newState.radiologyList[0].type).to.equal(labTypes.RADIOLOGY);
      expect(newState.listState).to.equal(loadStates.FETCHED);
      expect(newState.listCurrentAsOf).to.be.instanceOf(Date);
    });

    it('creates a list from CVIX radiology records', () => {
      const newState = radiologyReducer(undefined, {
        type: Actions.Radiology.GET_LIST,
        radiologyResponse: [],
        cvixRadiologyResponse: [mockCvixRadiologyRecord],
        isCurrent: false,
      });

      expect(newState.radiologyList).to.be.an('array');
      expect(newState.radiologyList.length).to.equal(1);
      expect(newState.radiologyList[0].type).to.equal(labTypes.CVIX_RADIOLOGY);
      expect(newState.listCurrentAsOf).to.be.null;
    });

    it('merges MHV and CVIX radiology records', () => {
      const newState = radiologyReducer(undefined, {
        type: Actions.Radiology.GET_LIST,
        radiologyResponse: [mockMhvRadiologyRecord],
        cvixRadiologyResponse: [mockCvixRadiologyRecord],
        isCurrent: true,
      });

      expect(newState.radiologyList).to.be.an('array');
      expect(newState.radiologyList.length).to.equal(2);

      const mhvRecord = newState.radiologyList.find(
        r => r.type === labTypes.RADIOLOGY,
      );
      const cvixRecord = newState.radiologyList.find(
        r => r.type === labTypes.CVIX_RADIOLOGY,
      );

      expect(mhvRecord).to.exist;
      expect(cvixRecord).to.exist;
    });

    it('puts updated records in updatedList when list already exists', () => {
      const existingState = {
        radiologyList: [{ id: 'existing-1', type: labTypes.RADIOLOGY }],
      };

      const newState = radiologyReducer(existingState, {
        type: Actions.Radiology.GET_LIST,
        radiologyResponse: [mockMhvRadiologyRecord],
        cvixRadiologyResponse: [mockCvixRadiologyRecord],
        isCurrent: false,
      });

      // Original list should remain unchanged
      expect(newState.radiologyList.length).to.equal(1);
      expect(newState.radiologyList[0].id).to.equal('existing-1');

      // Updated records should be in updatedList
      expect(newState.updatedList).to.be.an('array');
      expect(newState.updatedList.length).to.equal(2);
    });

    it('handles null/undefined responses gracefully', () => {
      const newState = radiologyReducer(undefined, {
        type: Actions.Radiology.GET_LIST,
        radiologyResponse: null,
        cvixRadiologyResponse: undefined,
        isCurrent: false,
      });

      expect(newState.radiologyList).to.be.an('array');
      expect(newState.radiologyList.length).to.equal(0);
    });

    it('filters out null records from responses', () => {
      const newState = radiologyReducer(undefined, {
        type: Actions.Radiology.GET_LIST,
        radiologyResponse: [null, mockMhvRadiologyRecord, null],
        cvixRadiologyResponse: [mockCvixRadiologyRecord, null],
        isCurrent: false,
      });

      expect(newState.radiologyList).to.be.an('array');
      expect(newState.radiologyList.length).to.equal(2);
    });

    it('sorts records by date descending', () => {
      const olderRecord = {
        ...mockMhvRadiologyRecord,
        id: 1,
        hash: 'older',
        eventDate: '2000-01-01T00:00:00Z',
      };
      const newerRecord = {
        ...mockMhvRadiologyRecord,
        id: 2,
        hash: 'newer',
        eventDate: '2024-12-01T00:00:00Z',
      };

      const newState = radiologyReducer(undefined, {
        type: Actions.Radiology.GET_LIST,
        radiologyResponse: [olderRecord, newerRecord],
        cvixRadiologyResponse: [],
        isCurrent: false,
      });

      expect(
        newState.radiologyList[0].sortDate > newState.radiologyList[1].sortDate,
      ).to.be.true;
    });
  });

  describe('GET', () => {
    it('should set radiologyDetails from merged response', () => {
      const mockPhrDetails = {
        id: 123,
        radiologist: 'DOE,JOHN',
        procedureName: 'X-RAY',
      };

      const newState = radiologyReducer(undefined, {
        type: Actions.Radiology.GET,
        response: {
          phrDetails: mockPhrDetails,
          cvixDetails: null,
        },
      });

      expect(newState.radiologyDetails).to.exist;
      expect(newState.radiologyDetails.id).to.exist;
    });
  });

  describe('GET_FROM_LIST', () => {
    it('should set radiologyDetails from response', () => {
      const mockRecord = {
        id: 'r123',
        name: 'CT SCAN',
        type: labTypes.RADIOLOGY,
      };

      const newState = radiologyReducer(undefined, {
        type: Actions.Radiology.GET_FROM_LIST,
        response: mockRecord,
      });

      expect(newState.radiologyDetails).to.deep.equal(mockRecord);
    });
  });

  describe('CLEAR_DETAIL', () => {
    it('should clear radiologyDetails', () => {
      const existingState = {
        radiologyDetails: { id: 'r123', name: 'CT SCAN' },
      };

      const newState = radiologyReducer(existingState, {
        type: Actions.Radiology.CLEAR_DETAIL,
      });

      expect(newState.radiologyDetails).to.be.undefined;
    });
  });

  describe('COPY_UPDATED_LIST', () => {
    it('should move updatedList into radiologyList when lengths differ', () => {
      const existingState = {
        radiologyList: [{ id: 'r1' }],
        updatedList: [{ id: 'r1' }, { id: 'r2' }],
      };

      const newState = radiologyReducer(existingState, {
        type: Actions.Radiology.COPY_UPDATED_LIST,
      });

      expect(newState.radiologyList.length).to.equal(2);
      expect(newState.updatedList).to.be.undefined;
    });

    it('should not move updatedList if lengths are the same', () => {
      const existingState = {
        radiologyList: [{ id: 'r1' }],
        updatedList: [{ id: 'r2' }],
      };

      const newState = radiologyReducer(existingState, {
        type: Actions.Radiology.COPY_UPDATED_LIST,
      });

      // radiologyList should remain unchanged
      expect(newState.radiologyList[0].id).to.equal('r1');
    });

    it('should not throw if updatedList is undefined', () => {
      const existingState = {
        radiologyList: [{ id: 'r1' }],
        updatedList: undefined,
      };

      const newState = radiologyReducer(existingState, {
        type: Actions.Radiology.COPY_UPDATED_LIST,
      });

      expect(newState.radiologyList.length).to.equal(1);
    });
  });

  describe('SET_DATE_RANGE', () => {
    it('should update dateRange', () => {
      const dateRange = {
        option: '6',
        fromDate: '2025-05-01',
        toDate: '2025-11-01',
      };

      const newState = radiologyReducer(undefined, {
        type: Actions.Radiology.SET_DATE_RANGE,
        payload: dateRange,
      });

      expect(newState.dateRange).to.deep.equal(dateRange);
    });
  });
});
