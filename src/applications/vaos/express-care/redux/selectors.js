export function selectExpressCareNewRequest(state) {
  return state.expressCare.newRequest;
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

export function selectExpressCare(state) {
  return state.expressCare;
}
