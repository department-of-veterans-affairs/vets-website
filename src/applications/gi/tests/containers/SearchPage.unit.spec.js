import _ from 'lodash';
import React from 'react';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';

import createCommonStore from '../../../../platform/startup/store';
import { SearchPage } from '../../containers/SearchPage';
import reducer from '../../reducers';

const defaultStore = createCommonStore(reducer);
const defaultProps = {
  ...defaultStore.getState(),
  fetchInstitutionSearchResults: sinon.spy(),
  setPageTitle: sinon.spy(),
  institutionFilterChange: sinon.spy(),
  eligibilityChange: sinon.spy(),
  showModal: sinon.spy(),
  location: {},
};

describe('<SearchPage>', () => {
  it('should render', () => {
    const tree = shallow(<SearchPage {...defaultProps} />);
    expect(tree).toBeDefined();
    tree.unmount();
  });

  it('should render LoadingIndicator', () => {
    const props = {
      ...defaultProps,
      search: {
        ...defaultProps.search,
        inProgress: true,
      },
    };

    const store = {
      ...defaultStore,
      state: {
        ...defaultProps,
        search: {
          ...defaultProps.search,
          inProgress: true,
        },
      },
    };

    const tree = mount(
      <Provider store={store}>
        <SearchPage {...props} />
      </Provider>,
    );

    expect(tree.find('LoadingIndicator').text()).toBe(
      'Loading search results...',
    );
    tree.unmount();
  });

  it('should call expected actions when mounted', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <SearchPage {...defaultProps} />
      </Provider>,
    );

    expect(defaultProps.fetchInstitutionSearchResults.called).toBe(true);
    expect(defaultProps.setPageTitle.called).toBe(true);
    tree.unmount();
  });
});

it('should render error message', () => {
  const props = {
    ...defaultProps,
    search: {
      ...defaultProps.search,
      inProgress: true,
      error: 'Service Unavailable',
    },
  };
  const tree = mount(
    <Provider store={defaultStore}>
      <SearchPage {...props} />
    </Provider>,
  );

  expect(tree.find('ServiceError')).toBeTruthy();
  tree.unmount();
});

describe('<SearchPage> functions', () => {
  it('updateSearchResults should set store correctly', () => {
    const booleanFilterParams = [
      'distanceLearning',
      'studentVeteranGroup',
      'yellowRibbonScholarship',
      'onlineOnly',
      'principlesOfExcellence',
      'eightKeysToVeteranSuccess',
      'stemIndicator',
      'priorityEnrollment',
      'independentStudy',
      'preferredProvider',
    ];

    const stringFilterParams = [
      'version',
      'category',
      'country',
      'state',
      'type',
    ];

    const stringSearchParams = ['page', 'name'];

    const institutionFilterChange = institutionFilter => {
      // Make sure searchParams are removed
      stringSearchParams.forEach(stringParam => {
        expect(Object.keys(institutionFilter).includes(stringParam)).toBe(
          false,
        );
      });

      // Make sure booleanParams have been converted from String to boolean
      booleanFilterParams.forEach(booleanParam => {
        expect(typeof institutionFilter[booleanParam]).toBe('boolean');
      });

      // Make sure stringParams are still Strings
      stringFilterParams.forEach(stringParam => {
        expect(typeof institutionFilter[stringParam]).toBe('string');
      });
    };

    const query = {
      distanceLearning: 'false',
      studentVeteranGroup: 'false',
      yellowRibbonScholarship: 'false',
      onlineOnly: 'false',
      principlesOfExcellence: 'false',
      eightKeysToVeteranSuccess: 'false',
      stemIndicator: 'false',
      priorityEnrollment: 'false',
      independentStudy: 'false',
      preferredProvider: 'false',
      version: '94ed39bf-f816-4b12-b3ce-a8241c2325b7',
      category: 'school',
      country: 'USA',
      state: 'SC',
      type: 'FLIGHT',
      page: '2',
      name: 'college of testing',
    };

    const search = `?${Object.keys(query)
      .map(key => `${key}=${query[key]}`)
      .join('&')}`;

    const fetchInstitutionSearchResults = queryStore => {
      const queryCheck = _.pick(query, [
        ...stringSearchParams,
        ...stringFilterParams,
        ...booleanFilterParams,
      ]);
      expect(queryStore.toString()).toBe(queryCheck.toString());
    };

    const props = {
      ...defaultProps,
      institutionFilterChange,
      fetchInstitutionSearchResults,
      location: {
        action: 'POP',
        basename: '/gi-bill-comparison-tool',
        hash: '',
        key: '1nwcws',
        pathname: '/search',
        query,
        search,
        state: undefined,
      },
    };

    const tree = shallow(<SearchPage {...props} />);
    const instance = tree.instance();
    instance.updateSearchResults();

    tree.unmount();
  });
});
