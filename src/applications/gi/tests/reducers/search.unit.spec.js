import searchReducer from '../../reducers/search';

describe('search reducer', () => {
  test('should toggle filters', () => {
    const state = searchReducer(
      { filterOpened: false },
      {
        type: 'FILTER_TOGGLED',
      },
    );

    expect(state.filterOpened).toBe(true);
  });

  test('should set search inProgress', () => {
    const state = searchReducer(
      { inProgress: false },
      {
        type: 'SEARCH_STARTED',
      },
    );

    expect(state.inProgress).toBe(true);
  });

  test('should set correct state on failure', () => {
    const state = searchReducer(
      { inProgress: true },
      {
        type: 'SEARCH_FAILED',
        payload: 'Service Unavailable',
      },
    );

    expect(state.inProgress).toBe(false);
    expect(state.error).toBe('Service Unavailable');
  });

  test('should set correct state on institution search success', () => {
    const state = searchReducer(
      { inProgress: true },
      {
        type: 'INSTITUTION_SEARCH_SUCCEEDED',
        payload: {
          data: [
            {
              attributes: {
                name: 'result_name',
              },
            },
          ],
          links: {
            self: 'url/to/data',
            last: 'url/to/data?page=1&per_page=10',
          },
          meta: {
            count: 1,
            version: 1,
            facets: {
              state: {
                stateFacetKey: 'value',
              },
              type: {
                typeFacetKey: 'value',
              },
            },
          },
        },
      },
    );

    expect(state.inProgress).toBe(false);
    expect(state.results.length).toBe(1);
    expect(state.results[0].name).toBe('RESULT_NAME');
    expect(state.facets.state.STATEFACETKEY).toBe('value');
    expect(state.facets.type.TYPEFACETKEY).toBe('value');
    expect(state.count).toBe(1);
    expect(state.version).toBe(1);
    expect(state.pagination.currentPage).toBe(1);
    expect(state.pagination.totalPages).toBe(1);
    expect(state.pagination.perPage).toBe(10);
  });

  test('should set correct state on program search success', () => {
    const state = searchReducer(
      { inProgress: true },
      {
        type: 'PROGRAM_SEARCH_SUCCEEDED',
        payload: {
          data: [
            {
              attributes: {
                description: 'result_name',
              },
            },
          ],
          links: {
            self: 'url/to/data',
            last: 'url/to/data?page=1&per_page=10',
          },
          meta: {
            count: 1,
            version: 1,
            facets: {
              state: {
                stateFacetKey: 'value',
              },
              type: {
                typeFacetKey: 'value',
              },
              provider: [{ name: 'provider 1', count: 1 }],
            },
          },
        },
      },
    );

    expect(state.inProgress).toBe(false);
    expect(state.results.length).toBe(1);
    expect(state.results[0].description).toBe('RESULT_NAME');
    expect(state.facets.state.STATEFACETKEY).toBe('value');
    expect(state.facets.type.TYPEFACETKEY).toBe('value');
    expect(state.facets.provider[0].name).toBe('PROVIDER 1');
    expect(state.count).toBe(1);
    expect(state.version).toBe(1);
    expect(state.pagination.currentPage).toBe(1);
    expect(state.pagination.totalPages).toBe(1);
    expect(state.pagination.perPage).toBe(10);
  });
});
