// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import times from 'lodash/times';
// Relative imports.
import { SearchResults } from './index';

describe('Yellow Ribbon container <SearchResults>', () => {
  it('renders a loading indicator', () => {
    const tree = shallow(<SearchResults fetching />);

    const loadingIndicator = tree.find('LoadingIndicator');
    expect(loadingIndicator).to.have.lengthOf(1);

    tree.unmount();
  });

  it('renders an error alert box', () => {
    const tree = shallow(<SearchResults error="test" />);

    expect(tree.html()).to.include('test');
    expect(tree.html()).to.include('Something went wrong');

    tree.unmount();
  });

  it('renders nothing', () => {
    const tree = shallow(<SearchResults />);

    expect(tree.isEmptyRender()).to.be.true;

    tree.unmount();
  });

  it('renders no results', () => {
    const tree = shallow(<SearchResults results={[]} />);

    expect(tree.html()).to.include('No results');

    tree.unmount();
  });

  it('renders a table and pagination', () => {
    const results = times(10, index => ({
      address1: '309 HARDIN ADMINISTRATION BLDG',
      address2: 'ACU BOX 29141',
      address3: null,
      bah: 1151,
      books: 1250,
      campusType: 'Y',
      cautionFlag: true,
      cautionFlagReason:
        'Warning or Equivalent-Factors Affecting Academic Quality (Concerns about issues affecting academic quality)',
      city: 'ABILENE',
      closure109: null,
      createdAt: '2019-12-11T17:31:21.000Z',
      distanceLearning: true,
      dodBah: 1062,
      eightKeys: null,
      facilityCode: '31000143',
      highestDegree: 4,
      id: `${index}-3333112`,
      independentStudy: true,
      localeType: 'city',
      name: 'ABILENE CHRISTIAN UNIVERSITY',
      onlineOnly: false,
      parentFacilityCodeId: null,
      physicalCity: 'ABILENE',
      physicalCountry: 'USA',
      physicalState: 'TX',
      physicalZip: '79699',
      poe: false,
      preferredProvider: false,
      priorityEnrollment: false,
      schoolClosing: false,
      state: 'TX',
      stemOffered: false,
      studentCount: 257,
      studentVeteran: null,
      tuitionInState: 29450,
      tuitionOutOfState: 29450,
      type: 'institutions',
      updatedAt: '2019-12-11T17:31:21.000Z',
      vetTecProvider: false,
      yr: true,
      zip: '79699',
    }));

    const tree = shallow(<SearchResults results={results} />);

    expect(tree.find('.search-results')).to.have.lengthOf(1);
    expect(tree.find('Pagination')).to.have.lengthOf(1);

    tree.unmount();
  });
});
