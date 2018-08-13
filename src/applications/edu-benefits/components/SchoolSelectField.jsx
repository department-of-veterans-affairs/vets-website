import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Pagination from '@department-of-veterans-affairs/formation/Pagination';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation/ErrorableCheckbox';
import Scroll from 'react-scroll';
import { connect } from 'react-redux';
import {
  clearSearch,
  searchInputChange,
  selectInstitution,
  searchSchools
} from '../complaint-tool/actions/schoolSearch';
import {
  selectCurrentPageNumber,
  selectFacilityCodeErrorMessages,
  selectFormSubmitted,
  selectInstitutionQuery,
  selectInstitutions,
  selectInstitutionSelected,
  selectManualSchoolEntryChecked,
  selectPagesCount,
  selectSearchInputValue,
  selectSearchResultsCount,
  selectShowInstitutions,
  selectShowInstitutionsLoading,
  selectShowNoResultsFound,
  selectShowPagination,
  selectShowPaginationLoading,
  selectShowSearchResults
} from '../complaint-tool/selectors/schoolSearch';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

export class SchoolSelectField extends React.Component {
  constructor(props) {
    super(props);

    this.debouncedSearchInstitutions = _.debounce(
      value => this.props.searchSchools(value),
      150);
  }

  componentWillUnmount() {
    this.debouncedSearchInstitutions.cancel();
  }

  scrollToTop = () => {
    scroller.scrollTo('schoolSearch', {
      duration: 250,
      delay: 0,
      smooth: true
    });
  };

  handleManualSchoolEntryToggled = (currentValue) => {
    this.props.onChange({
      facilityCode: this.props.facilityCodeSelected,
      'view:manualSchoolEntryChecked': !currentValue
    });
  }

  handleOptionClick = ({ city, facilityCode, name, state }) => {
    this.props.selectInstitution({ city, facilityCode, name, state });
    this.props.onChange({
      facilityCode,
      'view:manualSchoolEntryChecked': this.props.manualSchoolEntryChecked
    });
  }

  handlePageSelect = page => {
    this.scrollToTop();

    this.debouncedSearchInstitutions({
      institutionQuery: this.props.institutionQuery,
      page
    });
  }

  handleSearchInputKeyDown = e => {
    if ((e.which || e.keyCode) === 13) {
      e.preventDefault();
      e.target.blur();

      this.debouncedSearchInstitutions({ institutionQuery: this.props.searchInputValue });

      this.props.onChange({
        facilityCode: this.props.facilityCodeSelected,
        'view:manualSchoolEntryChecked': false
      });
    }
  }

  handleSearchClick = e => {
    e.preventDefault();

    this.props.onChange({
      facilityCode: this.props.facilityCodeSelected,
      'view:manualSchoolEntryChecked': false
    });
    this.debouncedSearchInstitutions({ institutionQuery: this.props.searchInputValue });
  }

  handleSearchInputChange = e => {
    let searchInputValue;
    if (typeof e === 'string') {
      searchInputValue = e;
    } else {
      searchInputValue = e.target.value;
    }

    this.props.searchInputChange({ searchInputValue });
  }

  handleStartOver = e => {
    e.preventDefault();

    this.props.onChange(null);
    this.props.clearSearch();
    this.searchInput.focus();
  }

  render() {
    const {
      currentPageNumber,
      errorMessages,
      facilityCodeSelected,
      formContext,
      institutionQuery,
      institutions,
      institutionSelected,
      manualSchoolEntryChecked,
      pagesCount,
      searchInputValue,
      searchResultsCount,
      showErrors,
      showInstitutions,
      showInstitutionsLoading,
      showNoResultsFound,
      showPagination,
      showPaginationLoading,
      showSearchResults
    } = this.props;

    const fieldsetClassNames = classNames('search-select-school-fieldset');
    const schoolSearchClassNames = classNames('school-search', {
      'usa-input-error': showErrors
    });
    const labelClassNames = classNames('school-search-label', {
      'usa-input-error-label': showErrors
    });

    if (formContext.reviewMode && manualSchoolEntryChecked) {
      return null;
    }

    if (formContext.reviewMode) {
      const {
        address1,
        address2,
        address3,
        city,
        country,
        name,
        state,
      } = institutionSelected;

      return (
        <div>
          {name && <p>{name}</p>}
          {address1 && <p>{address1}</p>}
          {address2 && <p>{address2}</p>}
          {address3 && <p>{address3}</p>}
          {(city || state) && <p>{`${city && city}${city && state && ', '}${state && state}`}</p>}
          {!city && !state && <p>{country}</p>}
        </div>
      );
    }

    return (
      <fieldset className={fieldsetClassNames}>
        <div>
          <div className={schoolSearchClassNames}>
            <label
              id="school-search-label"
              className={labelClassNames}
              htmlFor="school-search-input">
              {'School Information'}
              {!manualSchoolEntryChecked && <span className="schemaform-required-span">{'(*Required)'}</span>}
            </label>
            {showErrors && <span
              className="usa-input-error-message"
              role="alert"
              id="facility-code-error-message">
              {errorMessages.map((message, index) => (
                <span key={index}><span className="sr-only">Error</span>{message}</span>))
              }
            </span>}
            <span>
              {'Enter your school’s name or city to search for your school'}
            </span>
            <div className="search-controls">
              <Element name="schoolSearch"/>
              <div className="search-input">
                <input
                  name="school-search-input"
                  onChange={this.handleSearchInputChange}
                  onKeyDown={this.handleSearchInputKeyDown}
                  ref={input => { this.searchInput = input; }}
                  type="text"
                  value={searchInputValue}/>
                <button
                  className="search-schools-button usa-button-primary"
                  onClick={this.handleSearchClick}>
                  {'Search Schools'}
                </button>
              </div>
              <div className="clear-search">
                <button
                  className="va-button-link start-over"
                  onClick={this.handleStartOver}>
                  {'Start Over'}
                </button>
              </div>
            </div>
          </div>
          <ErrorableCheckbox
            checked={manualSchoolEntryChecked}
            onValueChange={() => this.handleManualSchoolEntryToggled(manualSchoolEntryChecked)}
            label={<span>Check the box to manually type in your school's name and address</span>}/>
          <div
            aria-live="polite"
            aria-relevant="additions text">
            {showSearchResults && searchResultsCount > 0 && <span>
              {`${searchResultsCount} results for ${institutionQuery}`}
            </span>}
            {showSearchResults && showInstitutions && <div>
              {institutions.map(({ address1, address2, address3, city, country, facilityCode, name, state }, index) => (
                <div key={index}>
                  <div className="radio-button">
                    <input
                      autoComplete="false"
                      checked={facilityCodeSelected === facilityCode}
                      id={`page-${currentPageNumber}-${index}`}
                      name={`page-${currentPageNumber}`}
                      type="radio"
                      onKeyDown={this.onKeyDown}
                      onChange={() => this.handleOptionClick({ city, facilityCode, name, state })}
                      value={facilityCode}/>
                    <label
                      id={`institution-${index}-label`}
                      htmlFor={`page-${currentPageNumber}-${index}`}>
                      <span className="institution-information">
                        {name && <span className="institution-name">{name}</span>}
                        {address1 && <span className="institution-address">{address1}</span>}
                        {address2 && <span className="institution-address">{address2}</span>}
                        {address3 && <span className="institution-address">{address3}</span>}
                        {(city || state) && <span className="institution-city-state">{`${city && city}${city && state && ', '}${state && state}`}</span>}
                        {!city && !state && <span className="institution-country">{country}</span>}
                      </span>
                    </label>
                  </div>
                </div>))
              }
            </div>
            }
            {showSearchResults && showInstitutionsLoading && <div>
              <LoadingIndicator message={`Searching ${institutionQuery}...`}/>
            </div>
            }
            {showSearchResults && showNoResultsFound && <div className="no-results-box">
              <p>
                <strong>
                  {'We can’t find your school'}
                </strong><br/>
                {'We’re sorry. We can’t find any school that matches your entry. Please try entering a different school name or city. Or, you can check the box to enter your school information yourself.'}
              </p>
            </div>}
            {showSearchResults && showPaginationLoading && <div>
              <LoadingIndicator message={`Loading page ${currentPageNumber} results for ${institutionQuery}...`}/>
            </div>
            }
          </div>
          {showSearchResults && showPagination && <Pagination
            page={currentPageNumber} pages={pagesCount} onPageSelect={this.handlePageSelect}/>}
        </div>
      </fieldset>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const currentPageNumber = selectCurrentPageNumber(state);
  const errorMessages = selectFacilityCodeErrorMessages(ownProps);
  const facilityCodeSelected = ownProps.formData ? ownProps.formData.facilityCode : '';
  const institutionQuery = selectInstitutionQuery(state);
  const institutions = selectInstitutions(state);
  const institutionSelected = selectInstitutionSelected(state);
  const manualSchoolEntryChecked = selectManualSchoolEntryChecked(state) || false;
  const pagesCount = selectPagesCount(state);
  const searchInputValue = selectSearchInputValue(state);
  const searchResultsCount = selectSearchResultsCount(state);
  const showErrors = errorMessages.length > 0 && selectFormSubmitted(ownProps) && !manualSchoolEntryChecked;
  const showInstitutions = selectShowInstitutions(state);
  const showInstitutionsLoading = selectShowInstitutionsLoading(state);
  const showNoResultsFound = selectShowNoResultsFound(state);
  const showPagination = selectShowPagination(state);
  const showPaginationLoading = selectShowPaginationLoading(state);
  const showSearchResults = selectShowSearchResults(state);

  return {
    currentPageNumber,
    errorMessages,
    facilityCodeSelected,
    institutionQuery,
    institutions,
    institutionSelected,
    manualSchoolEntryChecked,
    pagesCount,
    searchInputValue,
    searchResultsCount,
    showErrors,
    showInstitutions,
    showInstitutionsLoading,
    showNoResultsFound,
    showPagination,
    showPaginationLoading,
    showSearchResults
  };
};
const mapDispatchToProps = {
  clearSearch,
  searchInputChange,
  searchSchools,
  selectInstitution
};

SchoolSelectField.PropTypes = {
  currentPageNumber: React.PropTypes.number,
  errorMessages: React.PropTypes.array,
  facilityCodeSelected: React.PropTypes.string,
  institutionQuery: React.PropTypes.string,
  institutions: React.PropTypes.array,
  institutionSelected: React.PropTypes.string,
  manualSchoolEntryChecked: React.PropTypes.bool,
  pagesCount: React.PropTypes.number,
  searchInputValue: React.PropTypes.string,
  searchResultsCount: React.PropTypes.number,
  showErrors: React.PropTypes.bool,
  showInstitutions: React.PropTypes.bool.required,
  showInstitutionsLoading: React.PropTypes.bool.required,
  showNoResultsFound: React.PropTypes.bool.required,
  showPagination: React.PropTypes.bool.required,
  showPaginationLoading: React.PropTypes.bool.required,
  showSearchResults: React.PropTypes.bool.required
};

SchoolSelectField.defaultProps = {
  showInstitutions: false,
  showInstitutionsLoading: false,
  showNoResultsFound: false,
  showPagination: false,
  showPaginationLoading: false,
  showSearchResults: true
};

export default connect(mapStateToProps, mapDispatchToProps)(SchoolSelectField);
