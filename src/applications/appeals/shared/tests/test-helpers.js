export const mockStore = ({ data = {}, toggles = {} } = {}) => ({
  getState: () => ({
    form: { data },
    featureToggles: toggles,
  }),
  subscribe: () => {},
  dispatch: () => {},
});
