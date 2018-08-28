import React from 'react';
import {
  mount
} from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { SchoolSelectField } from '../../components/SchoolSelectField';

describe('<SchoolSelectField>', () => {
  it('should render initial search view', () => {
    const tree = mount(<SchoolSelectField
      formData={{}}
      formContext={{}}
      showInstitutions={false}
      showInstitutionsLoading={false}
      showPagination={false}
      showPaginationLoading={false}/>
    );

    expect(tree.find('.form-checkbox').exists()).to.be.true;
    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be.false;
    expect(tree.find('.institution-name').exists()).to.be.false;
    expect(tree.find('.loading-indicator-container').exists()).to.be.false;
    expect(tree.find('.va-pagination').exists()).to.be.false;
  });

  it('should render institution results view', () => {
    const institutions = [{
      address1: 'testStreet',
      address2: 'testStreet',
      address3: 'testStreet',
      city: 'testCity',
      facilityCode: 'test',
      name: 'testName',
      state: 'testState',
    }];
    const tree = mount(<SchoolSelectField
      formData={{}}
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
    expect(tree.find('.institution-city-state').text()).to.eql('testCity, testState');
    expect(tree.find('.institution-address').length).to.eql(3);
    expect(tree.find('.va-pagination').exists()).to.be.true;
    expect(tree.find('.loading-indicator-container').exists()).to.be.false;
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be.false;
  });

  it('should only render available institution information', () => {
    const institutions = [{
      city: '',
      facilitycode: 'test',
      name: 'testname',
      state: 'testState'
    }, {
      city: '',
      country: 'testCountry',
      facilitycode: 'test',
      name: 'testname',
      state: ''
    }];
    const tree = mount(<SchoolSelectField
      formData={{}}
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

    const institutionsTrees = tree.find('.radio-button label');
    expect(institutionsTrees.first().find('.institution-city-state').text()).to.eql('testState');
    expect(institutionsTrees.first().find('.institution-country').exists()).to.be.false;
    expect(institutionsTrees.last().find('.institution-city-state').exists()).to.be.false;
    expect(institutionsTrees.last().find('.institution-country').text()).to.eql('testCountry');
  });

  it('should render institutions loading view', () => {
    const tree = mount(<SchoolSelectField
      formData={{}}
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
      formData={{}}
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

  it('should render an error view', () => {
    const tree = mount(<SchoolSelectField
      formData={{}}
      errorMessages={[]}
      formContext={{}}
      currentPageNumber={1}
      institutionQuery="test"
      pagesCount={2}
      searchInputValue="test"
      searchResultsCount={1}
      showErrors
      showInstitutions={false}
      showInstitutionsLoading={false}
      showPagination
      showPaginationLoading/>
    );

    expect(tree.find('.usa-input-error').exists()).to.be.true;
  });

  it('should render no results or loading views when showSearchResults is false', () => {
    const institutions = [{
      city: '',
      facilitycode: 'test',
      name: 'testname',
      state: 'testState'
    }, {
      city: '',
      country: 'testCountry',
      facilitycode: 'test',
      name: 'testname',
      state: ''
    }];
    const tree = mount(<SchoolSelectField
      formData={{}}
      formContext={{}}
      currentPageNumber={1}
      institutions={institutions}
      institutionQuery="test"
      pagesCount={2}
      searchInputValue="test"
      searchResultsCount={1}
      showInstitutions
      showInstitutionsLoading
      showPagination
      showPaginationLoading
      showSearchResults={false}/>
    );

    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('.institution-name').exists()).to.be.false;
    expect(tree.find('.institution-city-state').exists()).to.be.false;
    expect(tree.find('.va-pagination').exists()).to.be.false;
    expect(tree.find('.loading-indicator-container').exists()).to.be.false;
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be.false;
  });

  // handleManualSchoolEntryToggled
  it('should call onChange props on when manual entry is toggled', () => {
    const onChange = sinon.spy();
    const tree = mount(<SchoolSelectField
      formData={{}}
      formContext={{}}
      currentPageNumber={1}
      facilityCodeSelected=""
      institutionQuery="test"
      onChange={onChange}
      pagesCount={2}
      searchInputValue="test"
      searchResultsCount={1}
      showInstitutions={false}
      showInstitutionsLoading={false}
      showPagination
      showPaginationLoading/>
    );

    tree.find('.form-checkbox input').first().simulate('change');
    expect(onChange.firstCall.args[0]).to.eql({ 'view:manualSchoolEntryChecked': true });
  });

  // handleSearchInputChange
  it('should call searchInputChange prop on input change', () => {
    const searchInputChange = sinon.spy();
    const tree = mount(<SchoolSelectField
      formData={{}}
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

  // handleSearchClick
  it('should call searchSchools and onChange props when search button clicked', (done) => {
    const searchSchools = sinon.spy();
    const onChange = sinon.spy();
    const tree = mount(<SchoolSelectField
      formData={{}}
      formContext={{}}
      currentPageNumber={1}
      facilityCodeSelected=""
      institutionQuery="test"
      onChange={onChange}
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
      expect(onChange.firstCall.args[0]).to.eql({
        'view:manualSchoolEntryChecked': false,
        'view:institutionQuery': 'test'
      });
      done();
    }, 200);
  });

  // handleOptionClick
  it('should call selectInstitution and onChange props when institution selected', () => {
    const selectInstitution = sinon.spy();
    const onChange = sinon.spy();
    const institutions = [{
      address1: 'testAddress1',
      address2: 'testAddress2',
      address3: 'testAddress3',
      city: 'testcity',
      facilityCode: 'test',
      name: 'testName',
      state: 'testState',
      zip: '12345',
      country: 'USA'
    }];
    const tree = mount(<SchoolSelectField
      formData={{}}
      formContext={{}}
      currentPageNumber={1}
      institutionQuery="test"
      institutions={institutions}
      onChange={onChange}
      manualSchoolEntryChecked={false}
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
    expect(onChange.firstCall.args[0]).to.eql({
      address: {
        city: 'testcity',
        country: 'United States',
        postalCode: '12345',
        state: 'testState',
        street: 'testAddress1',
        street2: 'testAddress2'
      },
      name: 'testName',
      'view:facilityCode': 'test'
    });
    expect(selectInstitution.firstCall.args[0]).to.eql({
      address1: 'testAddress1',
      address2: 'testAddress2',
      address3: 'testAddress3',
      city: 'testcity',
      facilityCode: 'test',
      name: 'testName',
      state: 'testState'
    });
  });

  // handleStartOver
  it('should call onChange and clearSearch props when start over is clicked', () => {
    const onChange = sinon.spy();
    const clearSearch = sinon.spy();
    const tree = mount(<SchoolSelectField
      formData={{}}
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
