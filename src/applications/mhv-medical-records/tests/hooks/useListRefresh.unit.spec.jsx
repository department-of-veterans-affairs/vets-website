// This is a pseudo-code example. Adapt it to your test runner and assertion library.

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import useListRefresh from '../../hooks/useListRefresh';
import {
  loadStates,
  refreshExtractTypes,
  refreshPhases,
  VALID_REFRESH_DURATION,
} from '../../util/constants';

function TestComponent(props) {
  useListRefresh(props);
  return <></>;
}

const defaultTestProps = {
  listState: loadStates.FETCHED,
  listCurrentAsOf: new Date(),
  refreshStatus: [
    {
      extract: refreshExtractTypes.ALLERGY,
      phase: refreshPhases.CURRENT,
    },
  ],
  extractType: refreshExtractTypes.ALLERGY,
  dispatchAction: () => {},
  dispatch: () => {},
};

const renderTestComponentWithProps = props => {
  const mergedProps = { ...defaultTestProps, ...props };
  const dispatchActionMock = sinon.spy();
  const dispatchMock = sinon.spy();

  render(
    <TestComponent
      {...mergedProps}
      dispatchAction={dispatchActionMock}
      dispatch={dispatchMock}
    />,
  );

  return { dispatchActionMock, dispatchMock };
};

describe('useListRefresh', () => {
  it('should not fetch data if list is present and refresh is current', async () => {
    const { dispatchActionMock } = renderTestComponentWithProps();

    await waitFor(() => {
      sinon.assert.notCalled(dispatchActionMock);
    });
  });

  it('should fetch data if list is not fetched yet', async () => {
    const { dispatchActionMock } = renderTestComponentWithProps({
      listState: loadStates.PRE_FETCH,
      listCurrentAsOf: undefined,
      refreshStatus: undefined,
    });

    await waitFor(() => {
      sinon.assert.called(dispatchActionMock);
    });
  });

  it('should fetch data if list is present but stale, and refresh is current', async () => {
    const { dispatchActionMock } = renderTestComponentWithProps({
      listCurrentAsOf: new Date() - VALID_REFRESH_DURATION - 1,
    });

    await waitFor(() => {
      sinon.assert.called(dispatchActionMock);
    });
  });

  it('should not fetch data if the list is currently being fetched, even if stale', async () => {
    const { dispatchActionMock } = renderTestComponentWithProps({
      listState: loadStates.FETCHING,
      listCurrentAsOf: new Date() - VALID_REFRESH_DURATION - 1,
    });

    await waitFor(() => {
      sinon.assert.notCalled(dispatchActionMock);
    });
  });

  it('should not fetch data if the list is present but stale, and refresh is stale', async () => {
    const { dispatchActionMock } = renderTestComponentWithProps({
      listCurrentAsOf: new Date() - VALID_REFRESH_DURATION - 1,
      refreshStatus: [
        {
          extract: refreshExtractTypes.ALLERGY,
          phase: refreshPhases.STALE,
        },
      ],
    });

    await waitFor(() => {
      sinon.assert.notCalled(dispatchActionMock);
    });
  });

  describe('with multiple extract types', () => {
    it('should fetch data if data is stale and all extract types are current', async () => {
      const { dispatchActionMock } = renderTestComponentWithProps({
        listCurrentAsOf: new Date() - VALID_REFRESH_DURATION - 1,
        refreshStatus: [
          {
            extract: refreshExtractTypes.ALLERGY,
            phase: refreshPhases.CURRENT,
          },
          { extract: refreshExtractTypes.VPR, phase: refreshPhases.CURRENT },
        ],
        extractType: [refreshExtractTypes.ALLERGY, refreshExtractTypes.VPR],
      });

      await waitFor(() => {
        sinon.assert.called(dispatchActionMock);
      });
    });

    it('should not fetch data if at least one extract type is not current', async () => {
      const { dispatchActionMock } = renderTestComponentWithProps({
        listCurrentAsOf: new Date() - VALID_REFRESH_DURATION - 1,
        refreshStatus: [
          {
            extract: refreshExtractTypes.ALLERGY,
            phase: refreshPhases.CURRENT,
          },
          { extract: refreshExtractTypes.VPR, phase: refreshPhases.STALE },
        ],
        extractType: [refreshExtractTypes.ALLERGY, refreshExtractTypes.VPR],
      });

      await waitFor(() => {
        sinon.assert.notCalled(dispatchActionMock);
      });
    });
  });

  describe('useBackendPagination if true', () => {
    it('should dispatch action with page when page changes', async () => {
      const dispatchActionMock = sinon.stub().returns('ACTION');
      const dispatchMock = sinon.spy();
      const page = 2;

      const { rerender } = render(
        <TestComponent
          {...defaultTestProps}
          dispatchAction={dispatchActionMock}
          dispatch={dispatchMock}
          page={page}
          useBackendPagination
        />,
      );

      await waitFor(() => {
        sinon.assert.calledWith(
          dispatchActionMock,
          sinon.match.bool,
          page,
          true,
        );
        sinon.assert.calledWith(dispatchMock, 'ACTION');
      });

      // Test with updated page
      const newPage = 3;
      rerender(
        <TestComponent
          {...defaultTestProps}
          dispatchAction={dispatchActionMock}
          dispatch={dispatchMock}
          page={newPage}
          useBackendPagination
        />,
      );

      await waitFor(() => {
        sinon.assert.calledWith(
          dispatchActionMock,
          sinon.match.bool,
          newPage,
          true,
        );
      });
    });

    it('should call checkUpdatesAction when data is stale', async () => {
      const dispatchActionMock = sinon.stub();
      const checkUpdatesActionMock = sinon
        .stub()
        .returns('CHECK_UPDATES_ACTION');
      const dispatchMock = sinon.spy();

      render(
        <TestComponent
          {...defaultTestProps}
          listCurrentAsOf={new Date() - VALID_REFRESH_DURATION - 1}
          dispatchAction={dispatchActionMock}
          dispatch={dispatchMock}
          checkUpdatesAction={checkUpdatesActionMock}
          useBackendPagination
        />,
      );

      await waitFor(() => {
        sinon.assert.called(checkUpdatesActionMock);
        sinon.assert.calledWith(dispatchMock, 'CHECK_UPDATES_ACTION');
        // Regular fetch action should not be called
        sinon.assert.notCalled(dispatchActionMock);
      });
    });

    it('should not call checkUpdatesAction when data is being fetched', async () => {
      const dispatchActionMock = sinon.stub();
      const checkUpdatesActionMock = sinon.stub();
      const dispatchMock = sinon.spy();

      render(
        <TestComponent
          {...defaultTestProps}
          listState={loadStates.FETCHING}
          listCurrentAsOf={new Date() - VALID_REFRESH_DURATION - 1}
          dispatchAction={dispatchActionMock}
          dispatch={dispatchMock}
          checkUpdatesAction={checkUpdatesActionMock}
          useBackendPagination
        />,
      );

      await waitFor(() => {
        sinon.assert.notCalled(checkUpdatesActionMock);
        sinon.assert.notCalled(dispatchActionMock);
      });
    });

    it('should not call checkUpdatesAction when data is not stale', async () => {
      const dispatchActionMock = sinon.stub();
      const checkUpdatesActionMock = sinon.stub();
      const dispatchMock = sinon.spy();

      render(
        <TestComponent
          {...defaultTestProps}
          dispatchAction={dispatchActionMock}
          dispatch={dispatchMock}
          checkUpdatesAction={checkUpdatesActionMock}
          useBackendPagination
        />,
      );

      await waitFor(() => {
        sinon.assert.notCalled(checkUpdatesActionMock);
        sinon.assert.notCalled(dispatchActionMock);
      });
    });
  });

  describe('useBackendPagination if false', () => {
    it('should not dispatch action with page', async () => {
      const dispatchActionMock = sinon.stub().returns('ACTION');
      const dispatchMock = sinon.spy();
      const page = 2;

      render(
        <TestComponent
          {...defaultTestProps}
          dispatchAction={dispatchActionMock}
          dispatch={dispatchMock}
          page={page}
          useBackendPagination={false}
        />,
      );

      await waitFor(() => {
        // Should not be called with page and useBackendPagination parameters
        sinon.assert.neverCalledWith(
          dispatchActionMock,
          sinon.match.bool,
          page,
          false,
        );
      });
    });

    it('should not call checkUpdatesAction when data is stale', async () => {
      const dispatchActionMock = sinon.stub().returns('ACTION');
      const checkUpdatesActionMock = sinon.stub();
      const dispatchMock = sinon.spy();

      render(
        <TestComponent
          {...defaultTestProps}
          listCurrentAsOf={new Date() - VALID_REFRESH_DURATION - 1}
          dispatchAction={dispatchActionMock}
          dispatch={dispatchMock}
          checkUpdatesAction={checkUpdatesActionMock}
          useBackendPagination={false}
        />,
      );

      await waitFor(() => {
        sinon.assert.notCalled(checkUpdatesActionMock);
        sinon.assert.calledWith(dispatchMock, 'ACTION');
        sinon.assert.called(dispatchActionMock);
      });
    });
  });
});
