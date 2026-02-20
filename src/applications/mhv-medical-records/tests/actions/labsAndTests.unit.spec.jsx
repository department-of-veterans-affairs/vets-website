import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import labsAndTests from '../fixtures/labsAndTests.json';
import pathology from '../fixtures/pathology.json';
import error404 from '../fixtures/404.json';
import {
  clearLabsAndTestDetails,
  getLabsAndTestsList,
  getLabsAndTestsDetails,
  getAcceleratedImagingStudiesList,
  getImagingStudyThumbnails,
  getImagingStudyDicomZip,
  mergeImagingStudies,
  updateLabsAndTestDateRange,
} from '../../actions/labsAndTests';

describe('getLabsAndTestsList error handling', () => {
  it('should dispatch an add alert action on error and not throw', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    // This should NOT throw - error should be handled internally
    await getLabsAndTestsList()(dispatch);
    // Verify alert was dispatched (second call after UPDATE_LIST_STATE)
    expect(typeof dispatch.secondCall.args[0]).to.equal('function');
  });

  it('should not dispatch GET_LIST when there is an error', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    await getLabsAndTestsList()(dispatch);
    const dispatchCalls = dispatch.getCalls();
    const getListCall = dispatchCalls.find(
      call => call.args[0].type === Actions.LabsAndTests.GET_LIST,
    );
    expect(getListCall).to.not.exist;
  });
});

describe('getLabsAndTestsDetails error handling', () => {
  it('should dispatch an add alert action on error and not throw', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    // This should NOT throw - error should be handled internally
    await getLabsAndTestsDetails('invalid-id', [])(dispatch);
    // Verify alert was dispatched
    expect(typeof dispatch.firstCall.args[0]).to.equal('function');
  });
});

describe('getLabsAndTestsList', () => {
  it('should dispatch a get list action', () => {
    const mockData = labsAndTests;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getLabsAndTestsList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.LabsAndTests.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.LabsAndTests.GET_LIST,
      );
    });
  });

  const runAcceleratingTest = async (mergeCvixWithScdf, assertion) => {
    const mockData = labsAndTests;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    await getLabsAndTestsList(false, true, {}, mergeCvixWithScdf)(dispatch);

    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.LabsAndTests.UPDATE_LIST_STATE,
    );
    expect(dispatch.secondCall.args[0].type).to.equal(
      Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
    );
    expect(dispatch.thirdCall.args[0].type).to.equal(
      Actions.LabsAndTests.SET_WARNINGS,
    );
    expect(dispatch.getCall(3).args[0].type).to.equal(
      Actions.LabsAndTests.GET_UNIFIED_LIST,
    );

    // Assert cvixRadiologyResponse according to merge flag
    assertion(dispatch.getCall(3).args[0].cvixRadiologyResponse);
  };

  it('should dispatch a get list action when accelerating (CVIX merge enabled)', () => {
    return runAcceleratingTest(true, cvixRadiologyResponse => {
      expect(cvixRadiologyResponse).to.exist;
    });
  });

  it('should dispatch a get list action when accelerating (CVIX merge disabled)', () => {
    return runAcceleratingTest(false, cvixRadiologyResponse => {
      expect(cvixRadiologyResponse).to.equal(undefined);
    });
  });

  it('should dispatch SET_WARNINGS with empty array when accelerated response is a plain array', async () => {
    const mockData = labsAndTests;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    await getLabsAndTestsList(false, true, {}, false)(dispatch);

    const setWarningsCall = dispatch
      .getCalls()
      .find(call => call.args[0].type === Actions.LabsAndTests.SET_WARNINGS);
    expect(setWarningsCall).to.exist;
    expect(setWarningsCall.args[0].payload).to.deep.equal([]);
  });

  it('should dispatch SET_WARNINGS with warnings when accelerated response contains meta.warnings', async () => {
    const mockWarnings = [
      { source: 'oracle-health', message: 'Binary resource not found' },
    ];
    const mockData = {
      data: labsAndTests.entry || [],
      meta: { warnings: mockWarnings },
    };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    await getLabsAndTestsList(false, true, {}, false)(dispatch);

    const setWarningsCall = dispatch
      .getCalls()
      .find(call => call.args[0].type === Actions.LabsAndTests.SET_WARNINGS);
    expect(setWarningsCall).to.exist;
    expect(setWarningsCall.args[0].payload).to.deep.equal(mockWarnings);
  });
});

describe('getLabsAndTestsDetails', () => {
  it('should dispatch a get details action', () => {
    const mockData = pathology;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getLabsAndTestsDetails('3106')(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.LabsAndTests.GET,
      );
    });
  });

  it('should dispatch a get details action and pull from the list argument', () => {
    const dispatch = sinon.spy();
    return getLabsAndTestsDetails('1', [{ id: '1' }])(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.LabsAndTests.GET_FROM_LIST,
      );
    });
  });

  it('should dispatch GET_UNIFIED_ITEM_FROM_LIST when accelerating with a non-"r" id and a populated list', async () => {
    // shouldAccelerate is true when isAccelerating=true and id does not start with 'r'
    // In this path, dispatchDetails should dispatch GET_UNIFIED_ITEM_FROM_LIST
    const dispatch = sinon.spy();
    await getLabsAndTestsDetails('1234', [{ id: '11234' }], true)(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.LabsAndTests.GET_UNIFIED_ITEM_FROM_LIST,
    );
  });

  it('should dispatch GET_FROM_LIST when accelerating with an "r" ID and a populated list', async () => {
    // Radiology IDs start with 'r' and should use GET_FROM_LIST (non-unified) even when accelerating
    const dispatch = sinon.spy();
    await getLabsAndTestsDetails('r5678', [{ id: 'r5678' }], true)(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.LabsAndTests.GET_FROM_LIST,
    );
  });

  it('should dispatch GET when accelerating with an "r" ID and no pre-loaded list', () => {
    mockApiRequest([{ id: 'r5678' }]);
    const dispatch = sinon.spy();
    return getLabsAndTestsDetails('r5678', undefined, true)(dispatch).then(
      () => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.LabsAndTests.GET,
        );
      },
    );
  });
});

describe('clearLabsAndTestDetails', () => {
  it('should dispatch a clear details action', () => {
    const dispatch = sinon.spy();
    return clearLabsAndTestDetails()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.LabsAndTests.CLEAR_DETAIL,
      );
    });
  });
});

describe('updateLabsAndTestDateRange', () => {
  it('should dispatch a set date range action with correct payload', () => {
    const dispatch = sinon.spy();
    const option = '6';
    const fromDate = '2025-05-13';
    const toDate = '2025-11-13';
    return updateLabsAndTestDateRange(option, fromDate, toDate)(dispatch).then(
      () => {
        expect(dispatch.calledOnce).to.be.true;
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(Actions.LabsAndTests.SET_DATE_RANGE);
        expect(action.payload).to.deep.equal({ option, fromDate, toDate });
      },
    );
  });
});

describe('mergeImagingStudies', () => {
  it('should dispatch MERGE_IMAGING_STUDIES', async () => {
    const dispatch = sinon.spy();
    await mergeImagingStudies()(dispatch);
    expect(dispatch.calledOnce).to.be.true;
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.LabsAndTests.MERGE_IMAGING_STUDIES,
    );
  });
});

describe('getAcceleratedImagingStudiesList', () => {
  it('should dispatch GET_IMAGING_STUDIES on success', async () => {
    const mockResponse = [{ id: 'study-1' }];
    mockApiRequest(mockResponse);
    const dispatch = sinon.spy();
    await getAcceleratedImagingStudiesList({
      startDate: '2025-01-01',
      endDate: '2025-06-01',
    })(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.LabsAndTests.GET_IMAGING_STUDIES,
    );
    expect(dispatch.firstCall.args[0].response).to.deep.equal(mockResponse);
  });

  it('should not dispatch an alert on error (silent failure) - TEMPORARY', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    await getAcceleratedImagingStudiesList()(dispatch);
    // Should NOT dispatch an alert (error is silent for now)
    const dispatchCalls = dispatch.getCalls();
    const alertCall = dispatchCalls.find(
      call => typeof call.args[0] === 'function',
    );
    expect(alertCall).to.not.exist;
  });
});

describe('getImagingStudyThumbnails', () => {
  it('should dispatch GET_IMAGING_STUDY_THUMBNAILS on success', async () => {
    const mockResponse = { series: [{ uid: 's1' }] };
    mockApiRequest(mockResponse);
    const dispatch = sinon.spy();
    await getImagingStudyThumbnails('study-1', {
      startDate: '2025-01-01',
      endDate: '2025-06-01',
    })(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.LabsAndTests.GET_IMAGING_STUDY_THUMBNAILS,
    );
    expect(dispatch.firstCall.args[0].id).to.equal('study-1');
  });

  it('should dispatch an alert on error', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    await getImagingStudyThumbnails('study-1')(dispatch);
    expect(typeof dispatch.firstCall.args[0]).to.equal('function');
  });
});

describe('getImagingStudyDicomZip', () => {
  it('should dispatch GET_IMAGING_STUDY_DICOM on success', async () => {
    const mockResponse = { dicomZipUrl: 'https://example.com/zip' };
    mockApiRequest(mockResponse);
    const dispatch = sinon.spy();
    await getImagingStudyDicomZip('study-1', {
      startDate: '2025-01-01',
      endDate: '2025-06-01',
    })(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.LabsAndTests.GET_IMAGING_STUDY_DICOM,
    );
    expect(dispatch.firstCall.args[0].id).to.equal('study-1');
  });

  it('should dispatch an alert on error', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    await getImagingStudyDicomZip('study-1')(dispatch);
    expect(typeof dispatch.firstCall.args[0]).to.equal('function');
  });
});
