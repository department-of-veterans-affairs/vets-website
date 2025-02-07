const initialState = {
  currentPage: 'introduction',
  routeMap: ['introduction'],
  outcome: null,
};

export default function navigationReducer(state = initialState, action) {
  switch (action.type) {
    case 'NAVIGATE_TO': {
      const { page, outcome } = action.payload;
      return {
        ...state,
        currentPage: page,
        routeMap: [...state.routeMap, page],
        outcome: outcome || null,
      };
    }
    case 'NAVIGATE_BACK': {
      const newRouteMap = state.routeMap.slice(0, -1);
      return {
        ...state,
        currentPage: newRouteMap[newRouteMap.length - 1] || 'introduction',
        routeMap: newRouteMap,
      };
    }
    case 'RESET_NAVIGATION': {
      return initialState;
    }
    default:
      return state;
  }
}
