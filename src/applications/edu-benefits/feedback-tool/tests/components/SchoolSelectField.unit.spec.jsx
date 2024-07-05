import React from 'react';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  SchoolSelectField,
  mapStateToProps,
} from '../../components/SchoolSelectField';
import { displaySingleLineAddress } from '../../helpers';

describe('<SchoolSelectField>', () => {
  it('should render initial search view', () => {
    const tree = mount(
      <SchoolSelectField
        formData={{}}
        formContext={{}}
        showInstitutions={false}
        showInstitutionsLoading={false}
        showPagination={false}
        showPaginationLoading={false}
      />,
    );

    expect(tree.find('va-checkbox').exists()).to.be.true;
    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be
      .false;
    expect(tree.find('.institution-name').exists()).to.be.false;
    expect(tree.find('va-loading-indicator').exists()).to.be.false;
    expect(tree.find('.va-pagination').exists()).to.be.false;
    tree.unmount();
  });

  it('should render institution results view', () => {
    const institutions = [
      {
        address1: 'testStreet',
        address2: 'testStreet',
        address3: 'testStreet',
        city: 'testCity',
        facilityCode: 'test',
        name: 'testName',
        state: 'testState',
      },
    ];
    const tree = mount(
      <SchoolSelectField
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
        showPaginationLoading={false}
      />,
    );

    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('va-radio').exists()).to.be.true;
    expect(tree.find('va-radio-option')).length.to.be(1);
    expect(tree.find('va-pagination').exists()).to.be.true;
    expect(tree.find('va-loading-indicator').exists()).to.be.false;
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be
      .false;
    tree.unmount();
  });

  it('should render institutions loading view', () => {
    const tree = mount(
      <SchoolSelectField
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
        showPaginationLoading={false}
      />,
    );

    const vaLoadingIndicatorMessage = tree.find('va-loading-indicator');
    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('va-pagination').exists()).to.be.false;
    expect(vaLoadingIndicatorMessage.exists()).to.be.true;
    expect(vaLoadingIndicatorMessage.prop('message')).to.eql(
      'Searching test...',
    );
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be
      .false;
    tree.unmount();
  });

  it('should render pagination loading view', () => {
    const tree = mount(
      <SchoolSelectField
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
        showPaginationLoading
      />,
    );

    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('va-pagination').exists()).to.be.true;
    expect(tree.find('va-loading-indicator').exists()).to.be.true;
    expect(tree.find('va-loading-indicator').prop('message')).to.eql(
      'Loading page 1 results for test...',
    );
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be
      .false;
    tree.unmount();
  });

  it('should render an error view', () => {
    const tree = mount(
      <SchoolSelectField
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
        showPaginationLoading
      />,
    );

    expect(tree.find('.usa-input-error').exists()).to.be.true;
    tree.unmount();
  });

  it('should render no results or loading views when showSearchResults is false', () => {
    const institutions = [
      {
        city: '',
        facilitycode: 'test',
        name: 'testname',
        state: 'testState',
      },
      {
        city: '',
        country: 'testCountry',
        facilitycode: 'test',
        name: 'testname',
        state: '',
      },
    ];
    const tree = mount(
      <SchoolSelectField
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
        showSearchResults={false}
      />,
    );

    expect(tree.find('.search-controls').exists()).to.be.true;
    expect(tree.find('.va-pagination').exists()).to.be.false;
    expect(tree.find('va-loading-indicator').exists()).to.be.false;
    expect(tree.find('#root_school_view:manualSchoolEntry_name').exists()).to.be
      .false;
    tree.unmount();
  });

  // handleManualSchoolEntryToggled
  it('should call onChange props on when manual entry is toggled', () => {
    const toggleManualSchoolEntry = sinon.spy();
    const onChange = sinon.spy();
    const { container } = render(
      <SchoolSelectField
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
        showPaginationLoading
        toggleManualSchoolEntry={toggleManualSchoolEntry}
      />,
    );

    const checkbox = container.getElementsByTagName('va-checkbox')[0];
    checkbox.__events.vaChange({ detail: { checked: true } });
    expect(onChange.firstCall.args[0]).to.eql({
      'view:manualSchoolEntryChecked': true,
    });
  });

  // handleSearchInputChange
  it('should call searchInputChange prop on input change', () => {
    const searchInputChange = sinon.spy();
    const tree = mount(
      <SchoolSelectField
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
        showPaginationLoading
      />,
    );

    tree
      .find('.search-controls input')
      .first()
      .simulate('change', { target: { value: 'tests' } });
    expect(searchInputChange.firstCall.args[0]).to.eql({
      searchInputValue: 'tests',
    });
    tree.unmount();
  });

  // handleSearchClick
  it('should call searchSchools and onChange props when search button clicked', done => {
    const searchSchools = sinon.spy();
    const onChange = sinon.spy();
    const tree = mount(
      <SchoolSelectField
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
        showPaginationLoading
      />,
    );

    tree
      .find('.search-schools-button')
      .first()
      .simulate('click');
    setTimeout(() => {
      expect(searchSchools.firstCall.args[0]).to.eql({
        institutionQuery: 'test',
      });
      expect(onChange.firstCall.args[0]).to.eql({
        address: {},
        name: null,
        facilityCode: null,
        'view:manualSchoolEntryChecked': false,
        'view:institutionQuery': 'test',
      });
      tree.unmount();
      done();
    }, 200);
  });

  // handleOptionClick
  describe('handleOptionClick', () => {
    let selectInstitution = sinon.spy();
    let onChange = sinon.spy();
    const domesticInstitution = {
      address1: 'testAddress1',
      address2: 'testAddress2',
      address3: 'testAddress3',
      city: 'testcity',
      facilityCode: 'test',
      name: 'testName',
      state: 'testState',
      zip: '12345',
      country: 'USA',
    };
    const internationalInstitution = {
      address1: 'testAddress1',
      address2: 'testAddress2',
      address3: 'testAddress3',
      city: 'testcity',
      facilityCode: 'test2',
      name: 'testName',
      state: null,
      zip: null,
      country: 'NOT THE UNITED STATES',
    };
    const institutions = [domesticInstitution, internationalInstitution];
    let tree;
    beforeEach(() => {
      selectInstitution = sinon.spy();
      onChange = sinon.spy();
      tree = mount(
        <SchoolSelectField
          formData={{}}
          formContext={{}}
          currentPageNumber={1}
          institutionQuery="test"
          institutions={institutions}
          onChange={onChange}
          manualSchoolEntryChecked={false}
          pagesCount={2}
          searchInputValue="test"
          searchResultsCount={2}
          selectInstitution={selectInstitution}
          showInstitutions
          showInstitutionsLoading={false}
          showPagination
          showPaginationLoading={false}
        />,
      );
    });
    afterEach(() => {
      tree.unmount();
    });
    
    it('should display options correctly and call `selectInstitution` and `onChange` props properly when domestic institution selected', () => {
      expect(displaySingleLineAddress(domesticInstitution)).to.equal('testAddress1, testAddress2, testAddress3, testcity, testState 12345');
      expect(tree.find('va-radio-option').length).to.equal(2);
      const vaRadio = tree.find('VaRadio')
      expect(vaRadio.exists()).to.be.true;
      vaRadio.props().onVaValueChange({ detail: { value: domesticInstitution.facilityCode, checked: true } });
      expect(onChange.firstCall.args[0]).to.eql({
        address: {
          city: domesticInstitution.city,
          country: 'United States',
          postalCode: domesticInstitution.zip,
          state: domesticInstitution.state,
          street: domesticInstitution.address1,
          street2: domesticInstitution.address2,
          street3: domesticInstitution.address3,
        },
        name: domesticInstitution.name,
        facilityCode: domesticInstitution.facilityCode,
      });
      expect(selectInstitution.firstCall.args[0]).to.eql({
        address1: domesticInstitution.address1,
        address2: domesticInstitution.address2,
        address3: domesticInstitution.address3,
        city: domesticInstitution.city,
        facilityCode: domesticInstitution.facilityCode,
        name: domesticInstitution.name,
        state: domesticInstitution.state,
      });
    });

    it('should display options correctly and call `selectInstitution` and `onChange` props properly when non-domestic institution selected', () => {
      expect(displaySingleLineAddress(internationalInstitution)).to.equal('testAddress1, testAddress2, testAddress3, testcity NOT THE UNITED STATES');
      expect(tree.find('va-radio-option').length).to.equal(2);
      const vaRadio = tree.find('VaRadio')
      expect(vaRadio.exists()).to.be.true;
      vaRadio.props().onVaValueChange({ detail: { value: internationalInstitution.facilityCode, checked: true } });
      expect(onChange.lastCall.args[0]).to.eql({
        address: {
          city: internationalInstitution.city,
          country: internationalInstitution.country,
          postalCode: internationalInstitution.zip,
          state: internationalInstitution.state,
          street: internationalInstitution.address1,
          street2: internationalInstitution.address2,
          street3: internationalInstitution.address3,
        },
        name: internationalInstitution.name,
        facilityCode: internationalInstitution.facilityCode,
      });
      expect(selectInstitution.lastCall.args[0]).to.eql({
        address1: internationalInstitution.address1,
        address2: internationalInstitution.address2,
        address3: internationalInstitution.address3,
        city: internationalInstitution.city,
        facilityCode: internationalInstitution.facilityCode,
        name: internationalInstitution.name,
        state: internationalInstitution.state,
      });
    });
  });

  // handleStartOver
  it('should call onChange and clearSearch props when start over is clicked', () => {
    const onChange = sinon.spy();
    const clearSearch = sinon.spy();
    const tree = mount(
      <SchoolSelectField
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
        showPaginationLoading={false}
      />,
    );

    tree
      .find('.clear-search va-button')
      .first()
      .simulate('click');
    expect(onChange.calledOnce).to.eql(true);
    expect(onChange.firstCall.args[0]).to.eql({});
    expect(clearSearch.calledOnce).to.eql(true);
    tree.unmount();
  });
  it('mapStateToProps Without Form Data', () => {
    const ownProps = {
      formContext: {
        submitted: false,
      },
      errorSchema: {
        facilityCode: {
          __errors: [],
        },
      },
    };

    const state = {
      schoolSelect: {
        currentPageNumber: 1,
        institutions: [],
        institutionQuery: '',
        institutionSelected: {},
        manualSchoolEntryChecked: false,
        pagesCount: 0,
        searchInputValue: '',
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: false,
        showNoResultsFound: false,
        showPagination: false,
        showPaginationLoading: false,
        showSearchResults: true,
      },
    };
    const wrapper = mapStateToProps(state, ownProps);
    expect(wrapper).to.not.be.null;
  });
  it('mapStateToProps With Form Data', () => {
    const ownProps = {
      formData: {},
      formContext: {
        submitted: false,
      },
      errorSchema: {
        facilityCode: {
          __errors: [],
        },
      },
    };

    const state = {
      schoolSelect: {
        currentPageNumber: 1,
        institutions: [],
        institutionQuery: '',
        institutionSelected: {},
        manualSchoolEntryChecked: false,
        pagesCount: 0,
        searchInputValue: '',
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: false,
        showNoResultsFound: false,
        showPagination: false,
        showPaginationLoading: false,
        showSearchResults: true,
      },
    };
    const wrapper = mapStateToProps(state, ownProps);
    expect(wrapper).to.not.be.null;
  });
  it('should Not render initial search view', () => {
    const tree = mount(
      <SchoolSelectField
        formData={{}}
        formContext={{ reviewMode: true }}
        showInstitutions={false}
        showInstitutionsLoading={false}
        showPagination={false}
        showPaginationLoading={false}
        manualSchoolEntryChecked
      />,
    );
    expect(tree.find('va-checkbox').exists()).to.be.false;
    tree.unmount();
  });
  it('should render reviewMode true with institutionSelected', () => {
    const institutionSelected = {
      name: 'John Doe',
      address1: '254 PHAYATHAI ROAD',
      address2: 'ENGINEERING BLDG 2',
      address3: 'ROOM 107   10330',
      city: 'BANGKOK',
      country: 'THAILAND',
      state: 'TX',
      zip: 12345,
    };
    const tree = mount(
      <SchoolSelectField
        formData={{}}
        formContext={{ reviewMode: true }}
        showInstitutions={false}
        showInstitutionsLoading={false}
        showPagination={false}
        showPaginationLoading={false}
        manualSchoolEntryChecked={false}
        institutionSelected={institutionSelected}
      />,
    );
    expect(tree.find('va-checkbox').exists()).to.be.false;
    tree.unmount();
  });
});
