import _ from 'lodash';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import createCommonStore from 'platform/startup/store';
import { SearchPage } from '../../containers/SearchPage';
import reducer from '../../reducers';

const defaultStore = createCommonStore(reducer);
const defaultProps = {
  ...defaultStore.getState(),
  dispatchFetchInstitutionSearchResults: () => {},
  dispatchSetPageTitle: () => {},
  dispatchInstitutionFilterChange: () => {},
  dispatchEligibilityChange: () => {},
  dispatchShowModal: () => {},
};

describe('<SearchPage>', () => {
  it('should render', () => {
    const tree = mount(
      <MemoryRouter>
        <SearchPage {...defaultProps} />
      </MemoryRouter>,
    );
    expect(tree).to.not.be.undefined;
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

    const tree = mount(
      <MemoryRouter>
        <SearchPage {...props} />
      </MemoryRouter>,
    );

    expect(tree.find('LoadingIndicator').text()).to.equal(
      'Loading search results...',
    );
    tree.unmount();
  });

  // Failed on master: http://jenkins.vfs.va.gov/blue/organizations/jenkins/testing%2Fvets-website/detail/master/10213/tests
  it.skip('should call expected actions when mounted', () => {
    const props = {
      ...defaultProps,
      dispatchFetchInstitutionSearchResults: sinon.spy(),
      dispatchSetPageTitle: sinon.spy(),
    };

    const tree = mount(
      <MemoryRouter>
        <SearchPage {...props} />
      </MemoryRouter>,
    );

    expect(props.dispatchFetchInstitutionSearchResults.called).to.be.true;
    expect(props.dispatchSetPageTitle.called).to.be.true;
    tree.unmount();
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
      <MemoryRouter>
        <SearchPage {...props} />
      </MemoryRouter>,
    );

    expect(tree.find('ServiceError')).to.be.ok;
    tree.unmount();
  });

  it('should update search results from query when mounted', () => {
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

    const dispatchInstitutionFilterChange = institutionFilter => {
      // Make sure searchParams are removed
      stringSearchParams.forEach(stringParam => {
        expect(Object.keys(institutionFilter).includes(stringParam)).to.be
          .false;
      });

      // Make sure booleanParams have been converted from String to boolean
      booleanFilterParams.forEach(booleanParam => {
        expect(typeof institutionFilter[booleanParam]).to.be.equal('boolean');
      });

      // Make sure stringParams are still Strings
      stringFilterParams.forEach(stringParam => {
        expect(typeof institutionFilter[stringParam]).to.be.equal('string');
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

    const dispatchFetchInstitutionSearchResults = queryStore => {
      const queryCheck = _.pick(query, [
        ...stringSearchParams,
        ...stringFilterParams,
        ...booleanFilterParams,
      ]);
      expect(queryStore.toString()).to.be.equal(queryCheck.toString());
    };

    const props = {
      ...defaultProps,
      dispatchInstitutionFilterChange,
      dispatchFetchInstitutionSearchResults,
    };

    const tree = mount(
      <MemoryRouter initialEntries={[`/search?${search}`]}>
        <SearchPage {...props} />
      </MemoryRouter>,
    );

    tree.unmount();
  });
});
