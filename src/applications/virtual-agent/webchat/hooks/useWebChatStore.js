import { useEffect, useRef } from 'react';
import StartConvoAndTrackUtterances from '../utils/startConvoAndTrackUtterances';

/**
 * Create a Web Chat Redux store with middleware wired for Virtual Agent.
 *
 * The `freeze` flag is used to temporarily block outbound activities
 * (e.g., when the token expiry alert is shown). It is passed via a ref
 * into middleware so we can toggle blocking without re-creating the store.
 *
 * @param {Object} params
 * @param {Function} params.createStore - Factory to create the Web Chat store
 * @param {boolean} [params.freeze=false] - When true, blocks outbound actions
 * @returns {import('redux').Store} Configured Web Chat Redux store
 */
export default function useWebChatStore({
  createStore,
  freeze = false,
  ...params
}) {
  // Keep freeze reactive without recreating the store
  const freezeRef = useRef(freeze);
  useEffect(
    () => {
      freezeRef.current = freeze;
    },
    [freeze],
  );

  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createStore(
      {},
      StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances({
        ...params,
        freezeRef,
      }),
    );
  }

  return storeRef.current;
}
