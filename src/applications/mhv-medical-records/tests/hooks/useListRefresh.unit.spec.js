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

describe('useListRefresh hook', () => {
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
});
