export function selectExpressCare(state) {
  return state.expressCare;
}

export function selectExpressCareNewRequest(state) {
  return selectExpressCare(state).newRequest;
}

export function selectExpressCareFormData(state) {
  return selectExpressCareNewRequest(state).data;
}

export function getExpressCareFormPageInfo(state, pageKey) {
  const newRequest = selectExpressCareNewRequest(state);
  return {
    schema: newRequest.pages[pageKey],
    data: newRequest.data,
    pageChangeInProgress: newRequest.pageChangeInProgress,
  };
}
