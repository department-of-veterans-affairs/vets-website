/* eslint-disable react/prop-types */
import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import useReloadResetListOnUnmount from '../../hooks/useReloadResetListOnUnmount';
import { loadStates } from '../../util/constants';

// Minimal harness component to exercise the hook's unmount behavior.
function TestComponent(props) {
  // test-only component
  const {
    listState,
    dispatch,
    updateListActionType,
    reloadRecordsAction,
  } = props;
  useReloadResetListOnUnmount({
    listState,
    dispatch,
    updateListActionType,
    reloadRecordsAction,
  });
  return <></>;
}

const renderWith = (override = {}) => {
  const dispatch = sinon.spy();
  // eslint-disable-next-line prettier/prettier
  const updateListActionType = override.updateListActionType || 'FETCHED';

  const { listState, reloadRecordsAction } = override;

  const utils = render(
    <TestComponent
      listState={listState}
      dispatch={dispatch}
      updateListActionType={updateListActionType}
      reloadRecordsAction={reloadRecordsAction}
    />,
  );
  return { dispatch, updateListActionType, listState, ...utils };
};

describe('useReloadResetListOnUnmount', () => {
  it('resets FETCHING to PRE_FETCH on unmount', () => {
    const { dispatch, unmount } = renderWith({
      listState: loadStates.FETCHING,
    });
    const pre = dispatch.callCount;
    unmount();
    const delta = dispatch.callCount - pre;
    sinon.assert.match(
      delta,
      1,
      'Expected one dispatch when state was FETCHING at unmount',
    );
    const resetAction = dispatch.args.find(
      args => args[0] && args[0].payload === loadStates.PRE_FETCH,
    );
    sinon.assert.match(
      !!resetAction,
      true,
      `No PRE_FETCH reset action found: ${JSON.stringify(dispatch.args)}`,
    );
  });

  it('does not dispatch when listState is PRE_FETCH', () => {
    const { dispatch, unmount } = renderWith({
      listState: loadStates.PRE_FETCH,
    });
    const pre = dispatch.callCount;
    unmount();
    sinon.assert.match(dispatch.callCount - pre, 0);
  });

  it('does not dispatch when listState is FETCHED', () => {
    const { dispatch, unmount } = renderWith({
      listState: loadStates.FETCHED,
    });
    const pre = dispatch.callCount;
    unmount();
    sinon.assert.match(dispatch.callCount - pre, 0);
  });

  it('does not reset if state changed from FETCHING to FETCHED before unmount', () => {
    const dispatch = sinon.spy();
    const { rerender, unmount } = render(
      <TestComponent
        listState={loadStates.FETCHING}
        dispatch={dispatch}
        updateListActionType="FETCHED"
      />,
    );
    // Transition to FETCHED before unmount
    rerender(
      <TestComponent
        listState={loadStates.FETCHED}
        dispatch={dispatch}
        updateListActionType="FETCHED"
      />,
    );
    const pre = dispatch.callCount;
    unmount();
    sinon.assert.match(dispatch.callCount - pre, 0);
  });
});
