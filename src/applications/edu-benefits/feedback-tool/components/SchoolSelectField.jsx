import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {
  VaPagination,
  VaLoadingIndicator,
  VaCheckbox,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Scroll from 'react-scroll';
import { connect } from 'react-redux';
import {
  clearSearch,
  restoreFromPrefill,
  searchInputChange,
  selectInstitution,
  searchSchools,
  toggleManualSchoolEntry,
} from '../actions/schoolSearch';
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
  selectShowSearchResults,
} from '../selectors/schoolSearch';
import {
  displaySingleLineAddress,
  transformSearchToolAddress,
} from '../helpers';

const { Element } = Scroll;

export class SchoolSelectField extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedSearchInstitutions = _.debounce(
      value => this.props.searchSchools(value),
      150,
    );
  }

  componentDidMount() {
    // hydrate search if restoring from SiP
    // if there is a search term stored in the form data
    // if the search term in the form data isn't already in the redux state and displayed
    const institutionSelected = this.props.formData['view:institutionSelected'];
    const searchTermToRestore = this.props.formData['view:institutionQuery'];
    const pageNumberToRestore = this.props.formData['view:currentPageNumber'];
    if (
      searchTermToRestore &&
      searchTermToRestore !== this.props.institutionQuery &&
      !this.props.showInstitutions
    ) {
      this.props.restoreFromPrefill({
        institutionSelected,
        institutionQuery: searchTermToRestore,
        page: pageNumberToRestore,
        searchInputValue: searchTermToRestore,
      });
    }
  }

  componentWillUnmount() {
    this.debouncedSearchInstitutions.cancel();
  }

  handleManualSchoolEntryToggled = currentValue => {
    this.props.toggleManualSchoolEntry(currentValue);
    this.props.onChange({
      ...this.props.formData,
      'view:manualSchoolEntryChecked': currentValue,
    });
  };

  handleOptionClick = institution => {
    const {
      address1,
      address2,
      address3,
      city,
      country,
      facilityCode,
      name,
      state,
      zip,
    } = institution;
    this.props.selectInstitution({
      address1,
      address2,
      address3,
      city,
      facilityCode,
      name,
      state,
    });
    const address = transformSearchToolAddress({
      address1,
      address2,
      address3,
      city,
      country,
      state,
      zip,
    });
    this.props.onChange({
      ...this.props.formData,
      name,
      facilityCode,
      address,
    });
  };

  handlePageSelect = e => {
    const { page } = e.detail;
    this.resultCount.focus();
    this.debouncedSearchInstitutions({
      institutionQuery: this.props.institutionQuery,
      page,
    });
    this.props.onChange({
      ...this.props.formData,
      'view:currentPageNumber': page,
    });
  };

  handleSearchInputKeyDown = e => {
    if ((e.which || e.keyCode) === 13) {
      e.preventDefault();
      e.target.blur();

      this.debouncedSearchInstitutions({
        institutionQuery: this.props.searchInputValue,
      });

      this.props.onChange({
        ...this.props.formData,
        'view:manualSchoolEntryChecked': false,
        'view:institutionQuery': this.props.searchInputValue,
      });
    }
  };

  handleSearchClick = e => {
    e.preventDefault();
    this.props.onChange({
      ...this.props.formData,
      name: null,
      facilityCode: null,
      address: {},
      'view:manualSchoolEntryChecked': false,
      'view:institutionQuery': this.props.searchInputValue,
    });
    this.debouncedSearchInstitutions({
      institutionQuery: this.props.searchInputValue,
    });
  };

  handleSearchInputChange = e => {
    let searchInputValue;
    if (typeof e === 'string') {
      searchInputValue = e;
    } else {
      searchInputValue = e.target.value;
    }

    this.props.searchInputChange({ searchInputValue });
  };

  handleStartOver = e => {
    e.preventDefault();

    this.props.onChange({});
    this.props.clearSearch();
    this.searchInput.focus();
  };

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
      showSearchResults,
    } = this.props;

    const fieldsetClassNames = classNames('search-select-school-fieldset');
    const schoolSearchClassNames = classNames('school-search', {
      'usa-input-error': showErrors,
    });
    const labelClassNames = classNames('school-search-label', {
      'usa-input-error-label': showErrors,
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
          {(city || state) && (
            <p>{`${city}${city && state && ', '}${state}`}</p>
          )}
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
              htmlFor="school-search-input"
            >
              School Information
              {!manualSchoolEntryChecked && (
                <span className="schemaform-required-span">(*Required)</span>
              )}
            </label>
            {showErrors && (
              <span
                className="usa-input-error-message"
                role="alert"
                id="facility-code-error-message"
              >
                {errorMessages.map((message, index) => (
                  <span key={index}>
                    <span className="sr-only">Error</span>
                    {message}
                  </span>
                ))}
              </span>
            )}
            <span>
              Enter your school’s name or city to search for your school
            </span>
            <div className="search-controls">
              <Element name="schoolSearch" />
              <div className="search-input">
                <input
                  id="school-search-input"
                  name="school-search-input"
                  onChange={this.handleSearchInputChange}
                  onKeyDown={this.handleSearchInputKeyDown}
                  ref={input => {
                    this.searchInput = input;
                  }}
                  type="text"
                  value={searchInputValue}
                />
                <button
                  className="search-schools-button usa-button-primary"
                  onClick={this.handleSearchClick}
                >
                  Search Schools
                </button>
              </div>
              <div className="clear-search vads-u-margin-top--1p5">
                <va-button onClick={this.handleStartOver} text="Reset Search" />
              </div>
            </div>
          </div>
          <VaCheckbox
            checked={manualSchoolEntryChecked}
            onVaChange={event =>
              this.handleManualSchoolEntryToggled(event.detail.checked)
            }
            label="I want to type in my school’s name and address."
          />
          <div aria-live="polite" aria-relevant="additions text">
            {showSearchResults &&
              searchResultsCount > 0 && (
                <div
                  className="search-results-count"
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  tabIndex="0"
                  ref={el => {
                    this.resultCount = el;
                  }}
                >
                  {`${searchResultsCount} results for ${institutionQuery}`}
                </div>
              )}
            {showSearchResults &&
              showInstitutions && (
                <VaRadio
                  className="school-select-field-radio"
                  onVaValueChange={e =>
                    this.handleOptionClick(
                      _.find(institutions, { facilityCode: e?.detail?.value }),
                    )
                  }
                >
                  {institutions.map(institution => {
                    const {
                      address1,
                      address2,
                      address3,
                      city,
                      country,
                      facilityCode,
                      name,
                      state,
                      zip,
                    } = institution;
                    return (
                      <VaRadioOption
                        name={`page-${currentPageNumber}-radio-option`}
                        className="school-select-field-radio-option"
                        key={facilityCode}
                        value={facilityCode}
                        checked={facilityCode === facilityCodeSelected}
                        label={name}
                        tile
                        description={displaySingleLineAddress({
                          address1,
                          address2,
                          address3,
                          city,
                          country,
                          state,
                          zip,
                        })}
                      />
                    );
                  })}
                </VaRadio>
              )}{' '}
            {showSearchResults &&
              showInstitutionsLoading && (
                <div>
                  <VaLoadingIndicator
                    message={`Searching ${institutionQuery}...`}
                  />
                </div>
              )}
            {showSearchResults &&
              showNoResultsFound && (
                <div className="no-results-box">
                  <p>
                    <strong>We can’t find your school</strong>
                    <br />
                    We’re sorry. We can’t find any school that matches your
                    entry. Please try entering a different school name or city.
                    Or, you can check the box to enter your school information
                    yourself.
                  </p>
                </div>
              )}
            {showSearchResults &&
              showPaginationLoading && (
                <div>
                  <VaLoadingIndicator
                    message={`Loading page ${currentPageNumber} results for ${institutionQuery}...`}
                  />
                </div>
              )}
          </div>
          {showSearchResults &&
            showPagination && (
              <VaPagination
                page={currentPageNumber}
                pages={pagesCount}
                ariaLabelSuffix="of school results"
                onPageSelect={this.handlePageSelect}
                maxPageListLength={10}
                showLastPage
              />
            )}
        </div>
      </fieldset>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const currentPageNumber = selectCurrentPageNumber(state);
  const errorMessages = selectFacilityCodeErrorMessages(ownProps);
  const facilityCodeSelected = ownProps.formData
    ? ownProps.formData.facilityCode
    : '';
  const institutionQuery = selectInstitutionQuery(state);
  const institutions = selectInstitutions(state);
  const institutionSelected = selectInstitutionSelected(state);
  const manualSchoolEntryChecked =
    selectManualSchoolEntryChecked(state) || false;
  const pagesCount = selectPagesCount(state);
  const searchInputValue = selectSearchInputValue(state);
  const searchResultsCount = selectSearchResultsCount(state);
  const showErrors =
    errorMessages.length > 0 &&
    selectFormSubmitted(ownProps) &&
    !manualSchoolEntryChecked;
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
    showSearchResults,
  };
};
const mapDispatchToProps = {
  clearSearch,
  restoreFromPrefill,
  searchInputChange,
  searchSchools,
  selectInstitution,
  toggleManualSchoolEntry,
};

SchoolSelectField.propTypes = {
  currentPageNumber: PropTypes.number,
  errorMessages: PropTypes.array,
  facilityCodeSelected: PropTypes.string,
  institutionQuery: PropTypes.string,
  institutions: PropTypes.array,
  institutionSelected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  manualSchoolEntryChecked: PropTypes.bool,
  pagesCount: PropTypes.number,
  searchInputValue: PropTypes.string,
  searchResultsCount: PropTypes.number,
  showErrors: PropTypes.bool,
  showInstitutions: PropTypes.bool.isRequired,
  showInstitutionsLoading: PropTypes.bool.isRequired,
  showNoResultsFound: PropTypes.bool.isRequired,
  showPagination: PropTypes.bool.isRequired,
  showPaginationLoading: PropTypes.bool.isRequired,
  showSearchResults: PropTypes.bool.isRequired,
};

SchoolSelectField.defaultProps = {
  showInstitutions: false,
  showInstitutionsLoading: false,
  showNoResultsFound: false,
  showPagination: false,
  showPaginationLoading: false,
  showSearchResults: true,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SchoolSelectField);
