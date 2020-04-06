import prescriptionsReducer from '../../reducers/prescriptions.js';

describe('prescriptions reducer', () => {
  test('should show a loading screen for active', () => {
    const state = prescriptionsReducer(
      { active: { loading: false } },
      { type: 'LOADING_ACTIVE' },
    );
    expect(state.active.loading).toBe(true);
  });

  test('should show a loading screen for history', () => {
    const state = prescriptionsReducer(
      { history: { loading: false } },
      { type: 'LOADING_HISTORY' },
    );
    expect(state.history.loading).toBe(true);
  });

  test('should handle failure to fetch active prescriptions', () => {
    const state = prescriptionsReducer(
      {
        items: ['123', '456', '789'],
      },
      {
        type: 'LOAD_PRESCRIPTIONS_FAILURE',
        active: true,
      },
    );
    expect(state.items).toBeNull();
    expect(state.active.loading).toBe(false);
  });

  test('should handle failure to fetch prescriptions history', () => {
    const state = prescriptionsReducer(
      {
        items: ['123', '456', '789'],
      },
      {
        type: 'LOAD_PRESCRIPTIONS_FAILURE',
      },
    );
    expect(state.items).toBeNull();
    expect(state.history.loading).toBe(false);
  });

  test('should handle a successful request for active prescriptions', () => {
    const state = prescriptionsReducer(
      {
        items: null,
      },
      {
        type: 'LOAD_PRESCRIPTIONS_SUCCESS',
        active: true,
        data: {
          data: ['item1', 'item2'],
          meta: {
            pagination: {
              currentPage: 1,
              totalPages: 1,
            },
            sort: { prescriptionName: 'ASC' },
          },
        },
      },
    );
    expect(state.items).toEqual(['item1', 'item2']);
    expect(state.active.sort.value).toBe('prescriptionName');
    expect(state.active.loading).toBe(false);
  });

  test('should handle a successful request for prescriptions history', () => {
    const state = prescriptionsReducer(
      {
        items: null,
      },
      {
        type: 'LOAD_PRESCRIPTIONS_SUCCESS',
        data: {
          data: ['item1', 'item2'],
          meta: {
            pagination: {
              currentPage: 1,
              totalPages: 1,
            },
            sort: { prescriptionName: 'ASC' },
          },
        },
      },
    );
    expect(state.items).toEqual(['item1', 'item2']);
    expect(state.history.sort.value).toBe('prescriptionName');
    expect(state.history.sort.order).toBe('ASC');
    expect(state.history.page).toBe(1);
    expect(state.history.pages).toBe(1);
    expect(state.history.loading).toBe(false);
  });
});
