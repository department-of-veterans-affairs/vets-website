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

let sandbox;

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
  const dispatchActionMock = sandbox.spy();
  const dispatchMock = sandbox.spy();

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
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should not fetch data if list is present and refresh is current', async () => {
    const { dispatchActionMock } = renderTestComponentWithProps();

    await waitFor(() => {
      sandbox.assert.notCalled(dispatchActionMock);
    });
  });

  it('should fetch data if list is not fetched yet', async () => {
    const { dispatchActionMock } = renderTestComponentWithProps({
      listState: loadStates.PRE_FETCH,
      listCurrentAsOf: undefined,
      refreshStatus: undefined,
    });

    await waitFor(() => {
      sandbox.assert.called(dispatchActionMock);
    });
  });

  it('should fetch data if list is present but stale, and refresh is current', async () => {
    const { dispatchActionMock } = renderTestComponentWithProps({
      listCurrentAsOf: new Date() - VALID_REFRESH_DURATION - 1,
    });

    await waitFor(() => {
      sandbox.assert.called(dispatchActionMock);
    });
  });

  it('should not fetch data if the list is currently being fetched, even if stale', async () => {
    const { dispatchActionMock } = renderTestComponentWithProps({
      listState: loadStates.FETCHING,
      listCurrentAsOf: new Date() - VALID_REFRESH_DURATION - 1,
    });

    await waitFor(() => {
      sandbox.assert.notCalled(dispatchActionMock);
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
      sandbox.assert.notCalled(dispatchActionMock);
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
        sandbox.assert.called(dispatchActionMock);
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
        sandbox.assert.notCalled(dispatchActionMock);
      });
    });
  });
});
