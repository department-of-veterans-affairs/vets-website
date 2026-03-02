import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import useDateRangeSelector from '../../hooks/useDateRangeSelector';
import { loadStates } from '../../util/constants';
import * as helpers from '../../util/helpers';
import * as DateRangeSelector from '../../components/shared/DateRangeSelector';

// Mock store creator
const createMockStore = () => ({
  getState: () => ({}),
  subscribe: () => () => {},
  dispatch: sinon.spy(),
});

// Test component that uses the hook
function TestComponent({
  updateDateRangeAction,
  updateListStateActionType,
  dataDogLabel,
  history,
  onHandleSelect,
}) {
  const handleDateRangeSelect = useDateRangeSelector({
    updateDateRangeAction,
    updateListStateActionType,
    dataDogLabel,
    history,
  });

  // Expose the handler to the test
  React.useEffect(
    () => {
      if (onHandleSelect) {
        onHandleSelect(handleDateRangeSelect);
      }
    },
    [handleDateRangeSelect, onHandleSelect],
  );

  return <div data-testid="test-component" />;
}

TestComponent.propTypes = {
  dataDogLabel: PropTypes.string.isRequired,
  updateDateRangeAction: PropTypes.func.isRequired,
  updateListStateActionType: PropTypes.string.isRequired,
  history: PropTypes.object,
  onHandleSelect: PropTypes.func,
};

describe('useDateRangeSelector', () => {
  let mockStore;
  let sandbox;
  let calculateDateRangeStub;
  let sendDataDogActionStub;
  let getDateRangeListStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockStore = createMockStore();

    // Stub helper functions
    calculateDateRangeStub = sandbox.stub(helpers, 'calculateDateRange');
    sendDataDogActionStub = sandbox.stub(helpers, 'sendDataDogAction');
    getDateRangeListStub = sandbox.stub(DateRangeSelector, 'getDateRangeList');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderHook = props => {
    let capturedHandler = null;

    render(
      <Provider store={mockStore}>
        <TestComponent
          {...props}
          onHandleSelect={handler => {
            capturedHandler = handler;
          }}
        />
      </Provider>,
    );

    return { capturedHandler: () => capturedHandler, store: mockStore };
  };

  it('should return a function', async () => {
    const updateDateRangeAction = sinon.stub().returns({ type: 'TEST_ACTION' });

    const { capturedHandler } = renderHook({
      updateDateRangeAction,
      updateListStateActionType: 'UPDATE_LIST_STATE',
      dataDogLabel: 'Test label',
    });

    await waitFor(() => {
      expect(typeof capturedHandler()).to.equal('function');
    });
  });

  it('should dispatch updateDateRangeAction with calculated date range', async () => {
    const updateDateRangeAction = sinon
      .stub()
      .returns({ type: 'SET_DATE_RANGE' });
    const updateListStateActionType = 'UPDATE_LIST_STATE';

    calculateDateRangeStub.returns({
      fromDate: '2024-01-01',
      toDate: '2024-03-31',
    });
    getDateRangeListStub.returns([{ value: '3', label: 'Last 3 months' }]);

    const { capturedHandler, store } = renderHook({
      updateDateRangeAction,
      updateListStateActionType,
      dataDogLabel: 'Test label',
    });

    await waitFor(() => {
      expect(capturedHandler()).to.not.be.null;
    });

    // Simulate the event
    const mockEvent = { detail: { value: '3' } };
    capturedHandler()(mockEvent);

    await waitFor(() => {
      expect(calculateDateRangeStub.calledWith('3')).to.be.true;
      expect(updateDateRangeAction.calledWith('3', '2024-01-01', '2024-03-31'))
        .to.be.true;
      expect(store.dispatch.called).to.be.true;
    });
  });

  it('should dispatch UPDATE_LIST_STATE action with PRE_FETCH payload', async () => {
    const updateDateRangeAction = sinon
      .stub()
      .returns({ type: 'SET_DATE_RANGE' });
    const updateListStateActionType = 'TEST_UPDATE_LIST_STATE';

    calculateDateRangeStub.returns({
      fromDate: '2024-01-01',
      toDate: '2024-03-31',
    });
    getDateRangeListStub.returns([{ value: '3', label: 'Last 3 months' }]);

    const { capturedHandler, store } = renderHook({
      updateDateRangeAction,
      updateListStateActionType,
      dataDogLabel: 'Test label',
    });

    await waitFor(() => {
      expect(capturedHandler()).to.not.be.null;
    });

    const mockEvent = { detail: { value: '3' } };
    capturedHandler()(mockEvent);

    await waitFor(() => {
      // Check that the UPDATE_LIST_STATE action was dispatched
      const updateListStateCall = store.dispatch
        .getCalls()
        .find(
          call =>
            call.args[0]?.type === updateListStateActionType &&
            call.args[0]?.payload === loadStates.PRE_FETCH,
        );
      expect(updateListStateCall).to.not.be.undefined;
    });
  });

  it('should send DataDog action with correct label', async () => {
    const updateDateRangeAction = sinon
      .stub()
      .returns({ type: 'SET_DATE_RANGE' });
    const dataDogLabel = 'Notes date option';

    calculateDateRangeStub.returns({
      fromDate: '2024-01-01',
      toDate: '2024-03-31',
    });
    getDateRangeListStub.returns([{ value: '3', label: 'Last 3 months' }]);

    const { capturedHandler } = renderHook({
      updateDateRangeAction,
      updateListStateActionType: 'UPDATE_LIST_STATE',
      dataDogLabel,
    });

    await waitFor(() => {
      expect(capturedHandler()).to.not.be.null;
    });

    const mockEvent = { detail: { value: '3' } };
    capturedHandler()(mockEvent);

    await waitFor(() => {
      expect(
        sendDataDogActionStub.calledWith('Notes date option - Last 3 months'),
      ).to.be.true;
    });
  });

  it('should use "Unknown" label when option is not found in date range list', async () => {
    const updateDateRangeAction = sinon
      .stub()
      .returns({ type: 'SET_DATE_RANGE' });

    calculateDateRangeStub.returns({
      fromDate: '2024-01-01',
      toDate: '2024-12-31',
    });
    getDateRangeListStub.returns([{ value: '3', label: 'Last 3 months' }]);

    const { capturedHandler } = renderHook({
      updateDateRangeAction,
      updateListStateActionType: 'UPDATE_LIST_STATE',
      dataDogLabel: 'Test label',
    });

    await waitFor(() => {
      expect(capturedHandler()).to.not.be.null;
    });

    // Use a value that won't be found in the list
    const mockEvent = { detail: { value: 'unknown-value' } };
    capturedHandler()(mockEvent);

    await waitFor(() => {
      expect(sendDataDogActionStub.calledWith('Test label - Unknown')).to.be
        .true;
    });
  });

  it('should handle year-based date range selection', async () => {
    const updateDateRangeAction = sinon
      .stub()
      .returns({ type: 'SET_DATE_RANGE' });

    calculateDateRangeStub.returns({
      fromDate: '2023-01-01',
      toDate: '2023-12-31',
    });
    getDateRangeListStub.returns([
      { value: '3', label: 'Last 3 months' },
      { value: '2023', label: 'All of 2023' },
    ]);

    const { capturedHandler, store } = renderHook({
      updateDateRangeAction,
      updateListStateActionType: 'UPDATE_LIST_STATE',
      dataDogLabel: 'Date range option',
    });

    await waitFor(() => {
      expect(capturedHandler()).to.not.be.null;
    });

    const mockEvent = { detail: { value: '2023' } };
    capturedHandler()(mockEvent);

    await waitFor(() => {
      expect(calculateDateRangeStub.calledWith('2023')).to.be.true;
      expect(
        updateDateRangeAction.calledWith('2023', '2023-01-01', '2023-12-31'),
      ).to.be.true;
      expect(
        sendDataDogActionStub.calledWith('Date range option - All of 2023'),
      ).to.be.true;
      expect(store.dispatch.called).to.be.true;
    });
  });

  describe('pagination reset functionality', () => {
    it('should reset URL to page 1 when history is provided', async () => {
      const updateDateRangeAction = sinon
        .stub()
        .returns({ type: 'SET_DATE_RANGE' });
      const mockHistory = {
        push: sinon.spy(),
        location: { pathname: '/my-health/medical-records/labs-and-tests' },
      };

      calculateDateRangeStub.returns({
        fromDate: '2024-01-01',
        toDate: '2024-03-31',
      });
      getDateRangeListStub.returns([{ value: '3', label: 'Last 3 months' }]);

      const { capturedHandler } = renderHook({
        updateDateRangeAction,
        updateListStateActionType: 'UPDATE_LIST_STATE',
        dataDogLabel: 'Test label',
        history: mockHistory,
      });

      await waitFor(() => {
        expect(capturedHandler()).to.not.be.null;
      });

      const mockEvent = { detail: { value: '3' } };
      capturedHandler()(mockEvent);

      await waitFor(() => {
        expect(mockHistory.push.calledOnce).to.be.true;
        expect(
          mockHistory.push.calledWith(
            '/my-health/medical-records/labs-and-tests?page=1',
          ),
        ).to.be.true;
      });
    });

    it('should reset URL with correct path for care summaries and notes', async () => {
      const updateDateRangeAction = sinon
        .stub()
        .returns({ type: 'SET_DATE_RANGE' });
      const mockHistory = {
        push: sinon.spy(),
        location: {
          pathname: '/my-health/medical-records/summaries-and-notes',
        },
      };

      calculateDateRangeStub.returns({
        fromDate: '2023-01-01',
        toDate: '2023-12-31',
      });
      getDateRangeListStub.returns([{ value: '2023', label: 'All of 2023' }]);

      const { capturedHandler } = renderHook({
        updateDateRangeAction,
        updateListStateActionType: 'UPDATE_LIST_STATE',
        dataDogLabel: 'Notes date option',
        history: mockHistory,
      });

      await waitFor(() => {
        expect(capturedHandler()).to.not.be.null;
      });

      const mockEvent = { detail: { value: '2023' } };
      capturedHandler()(mockEvent);

      await waitFor(() => {
        expect(mockHistory.push.calledOnce).to.be.true;
        expect(
          mockHistory.push.calledWith(
            '/my-health/medical-records/summaries-and-notes?page=1',
          ),
        ).to.be.true;
      });
    });

    it('should reset URL before dispatching Redux actions', async () => {
      const updateDateRangeAction = sinon
        .stub()
        .returns({ type: 'SET_DATE_RANGE' });
      const mockHistory = {
        push: sinon.spy(),
        location: { pathname: '/my-health/medical-records/labs-and-tests' },
      };

      calculateDateRangeStub.returns({
        fromDate: '2024-01-01',
        toDate: '2024-03-31',
      });
      getDateRangeListStub.returns([{ value: '3', label: 'Last 3 months' }]);

      const { capturedHandler, store } = renderHook({
        updateDateRangeAction,
        updateListStateActionType: 'UPDATE_LIST_STATE',
        dataDogLabel: 'Test label',
        history: mockHistory,
      });

      await waitFor(() => {
        expect(capturedHandler()).to.not.be.null;
      });

      const mockEvent = { detail: { value: '3' } };
      capturedHandler()(mockEvent);

      await waitFor(() => {
        // History push should be called before any dispatch
        expect(mockHistory.push.calledBefore(store.dispatch)).to.be.true;
      });
    });

    it('should work without history parameter (backward compatibility)', async () => {
      const updateDateRangeAction = sinon
        .stub()
        .returns({ type: 'SET_DATE_RANGE' });

      calculateDateRangeStub.returns({
        fromDate: '2024-01-01',
        toDate: '2024-03-31',
      });
      getDateRangeListStub.returns([{ value: '3', label: 'Last 3 months' }]);

      const { capturedHandler, store } = renderHook({
        updateDateRangeAction,
        updateListStateActionType: 'UPDATE_LIST_STATE',
        dataDogLabel: 'Test label',
        // No history parameter
      });

      await waitFor(() => {
        expect(capturedHandler()).to.not.be.null;
      });

      const mockEvent = { detail: { value: '3' } };

      // Should not throw error when history is not provided
      let error = null;
      try {
        capturedHandler()(mockEvent);
      } catch (e) {
        error = e;
      }

      await waitFor(() => {
        expect(error).to.be.null;
        expect(store.dispatch.called).to.be.true;
        expect(updateDateRangeAction.called).to.be.true;
      });
    });

    it('should handle history.push when user is on page 2 or later', async () => {
      const updateDateRangeAction = sinon
        .stub()
        .returns({ type: 'SET_DATE_RANGE' });
      const mockHistory = {
        push: sinon.spy(),
        location: {
          pathname: '/my-health/medical-records/labs-and-tests',
          search: '?page=2', // User is currently on page 2
        },
      };

      calculateDateRangeStub.returns({
        fromDate: '2024-01-01',
        toDate: '2024-03-31',
      });
      getDateRangeListStub.returns([{ value: '3', label: 'Last 3 months' }]);

      const { capturedHandler } = renderHook({
        updateDateRangeAction,
        updateListStateActionType: 'UPDATE_LIST_STATE',
        dataDogLabel: 'Test label',
        history: mockHistory,
      });

      await waitFor(() => {
        expect(capturedHandler()).to.not.be.null;
      });

      const mockEvent = { detail: { value: '3' } };
      capturedHandler()(mockEvent);

      await waitFor(() => {
        // Should still navigate to page=1, replacing the current ?page=2
        expect(
          mockHistory.push.calledWith(
            '/my-health/medical-records/labs-and-tests?page=1',
          ),
        ).to.be.true;
      });
    });
  });
});
