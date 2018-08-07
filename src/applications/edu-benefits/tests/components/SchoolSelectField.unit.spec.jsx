import React from 'react';
import {
  shallow,
  mount
} from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { SchoolSelectField } from '../../components/SchoolSelectField';

describe('<SchoolSelectField>', () => {
  it('should render initial search view', () => {
    const tree = shallow(<SchoolSelectField
      formContext={{}}
      showInstitutions={false}
      showInstitutionsLoading={false}
      showPagination={false}
      showPaginationLoading={false}/>
    );

    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be.false;
    expect(tree.find('.institution-name').exists()).to.be.false;
    expect(tree.find('.loading-indicator-container').exists()).to.be.false;
    expect(tree.find('.va-pagination').exists()).to.be.false;
  });

  it('should render institution results view', () => {
    const institutions = [{
      city: 'testcity',
      facilityCode: 'test',
      name: 'testName',
      state: 'testState'
    }];
    const tree = mount(<SchoolSelectField
      formContext={{}}
      currentPageNumber={1}
      institutionQuery="test"
      institutions={institutions}
      pagesCount={2}
      searchInputValue="test"
      searchResultsCount={1}
      showInstitutions
      showInstitutionsLoading={false}
      showPagination
      showPaginationLoading={false}/>
    );

    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('.institution-name').exists()).to.be.true;
    expect(tree.find('.institution-city-state').exists()).to.be.true;
    expect(tree.find('.va-pagination').exists()).to.be.true;
    expect(tree.find('.loading-indicator-container').exists()).to.be.false;
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be.false;
  });

  it('should render institutions loading view', () => {
    const tree = mount(<SchoolSelectField
      formContext={{}}
      currentPageNumber={1}
      institutionQuery="test"
      pagesCount={2}
      searchInputValue="test"
      searchResultsCount={1}
      showInstitutions={false}
      showInstitutionsLoading
      showPagination={false}
      showPaginationLoading={false}/>
    );

    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('.institution-name').exists()).to.be.false;
    expect(tree.find('.institution-city-state').exists()).to.be.false;
    expect(tree.find('.va-pagination').exists()).to.be.false;
    expect(tree.find('.loading-indicator-container').exists()).to.be.true;
    expect(tree.find('.loading-indicator-container').text()).to.eql('Searching test...');
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be.false;
  });

  it('should render pagination loading view', () => {
    const tree = mount(<SchoolSelectField
      formContext={{}}
      currentPageNumber={1}
      institutionQuery="test"
      pagesCount={2}
      searchInputValue="test"
      searchResultsCount={1}
      showInstitutions={false}
      showInstitutionsLoading={false}
      showPagination
      showPaginationLoading/>
    );

    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('.institution-name').exists()).to.be.false;
    expect(tree.find('.institution-city-state').exists()).to.be.false;
    expect(tree.find('.va-pagination').exists()).to.be.true;
    expect(tree.find('.loading-indicator-container').exists()).to.be.true;
    expect(tree.find('.loading-indicator-container').text()).to.eql('Loading page 1 results for test...');
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be.false;
  });

  it('should call searchInputChange prop on input change', () => {
    const searchInputChange = sinon.spy();
    const tree = mount(<SchoolSelectField
      formContext={{}}
      currentPageNumber={1}
      institutionQuery="test"
      pagesCount={2}
      searchInputChange={searchInputChange}
      searchInputValue="test"
      searchResultsCount={1}
      showInstitutions={false}
      showInstitutionsLoading={false}
      showPagination
      showPaginationLoading/>
    );

    tree.find('.search-controls input').first().simulate('change', { target: { value: 'tests' } });
    expect(searchInputChange.firstCall.args[0]).to.eql({ searchInputValue: 'tests' });
  });

  it('should call searchSchools prop when search button clicked', (done) => {
    const searchSchools = sinon.spy();
    const tree = mount(<SchoolSelectField
      formContext={{}}
      currentPageNumber={1}
      institutionQuery="test"
      pagesCount={2}
      searchSchools={searchSchools}
      searchInputValue="test"
      searchResultsCount={1}
      showInstitutions={false}
      showInstitutionsLoading={false}
      showPagination
      showPaginationLoading/>
    );

    tree.find('.search-schools-button').first().simulate('click');
    setTimeout(() => {
      expect(searchSchools.firstCall.args[0]).to.eql({ institutionQuery: 'test' });
      done();
    }, 200);
  });

  it('should call selectInstitution prop when institution selected', () => {
    const selectInstitution = sinon.spy();
    const onChange = sinon.spy();
    const institutions = [{
      city: 'testcity',
      facilityCode: 'test',
      name: 'testName',
      state: 'testState'
    }];
    const tree = mount(<SchoolSelectField
      formContext={{}}
      currentPageNumber={1}
      institutionQuery="test"
      institutions={institutions}
      onChange={onChange}
      pagesCount={2}
      searchInputValue="test"
      searchResultsCount={1}
      selectInstitution={selectInstitution}
      showInstitutions
      showInstitutionsLoading={false}
      showPagination
      showPaginationLoading={false}/>
    );

    tree.find('#page-1-0').first().simulate('change');
    expect(onChange.firstCall.args[0]).to.eql('test');
    expect(selectInstitution.firstCall.args[0]).to.eql(institutions[0]);
  });

  it('should call onChange and clearSearch props when start over is clicked', () => {
    const onChange = sinon.spy();
    const clearSearch = sinon.spy();
    const tree = mount(<SchoolSelectField
      formContext={{}}
      clearSearch={clearSearch}
      currentPageNumber={1}
      institutionQuery="test"
      institutions={[]}
      onChange={onChange}
      pagesCount={2}
      searchInputValue="test"
      searchResultsCount={1}
      showInstitutions={false}
      showInstitutionsLoading={false}
      showNoResultsFound
      showPagination={false}
      showPaginationLoading={false}/>
    );

    tree.find('.clear-search button').first().simulate('click');
    expect(onChange.calledOnce).to.eql(true);
    expect(clearSearch.calledOnce).to.eql(true);
  });
});
