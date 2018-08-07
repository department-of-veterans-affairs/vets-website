import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Pagination from '@department-of-veterans-affairs/formation/Pagination';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
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
  selectInstitutionQuery,
  selectInstitutions,
  selectInstitutionSelected,
  selectPagesCount,
  selectSearchInputValue,
  selectSearchResultsCount,
  selectShowInstitutions,
  selectShowInstitutionsLoading,
  selectShowNoResultsFound,
  selectShowPagination,
  selectShowPaginationLoading
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

  handleOptionClick = ({ city, facilityCode, name, state }) => {
    this.props.selectInstitution({ city, facilityCode, name, state });
    this.props.onChange(facilityCode);
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
    }
  }

  handleSearchClick = e => {
    e.preventDefault();

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

    this.props.onChange('');
    this.props.clearSearch();
    this.searchInput.focus();
  }

  render() {
    const {
      currentPageNumber,
      facilityCodeSelected,
      formContext,
      institutionQuery,
      institutions,
      institutionSelected,
      pagesCount,
      searchInputValue,
      searchResultsCount,
      showInstitutions,
      showInstitutionsLoading,
      showNoResultsFound,
      showPagination,
      showPaginationLoading,
    } = this.props;

    const fieldsetClass = classNames('search-select-school-fieldset');
    const clearSearchInfoClass = classNames('clear-search', {
      info: showInstitutions
    });


    if (formContext.reviewMode) {
      const {
        city,
        name,
        state
      } = institutionSelected;

      return (
        <div>
          <p>{name}</p>
          <p>{`${city}, ${state}`}</p>
        </div>
      );
    }

    return (
      <fieldset className={fieldsetClass}>
        <div>
          <div className="search-controls">
            <Element name="schoolSearch"/>
            <div className="search-input">
              <input
                onChange={this.handleSearchInputChange}
                onKeyDown={this.handleSearchInputKeyDown}
                ref={input => { this.searchInput = input; }}
                type="text"
                value={searchInputValue}/>
              <div
                className={clearSearchInfoClass}>
                {showInstitutions && <span>
                  {`${searchResultsCount} results for ${institutionQuery}`}
                </span>}
                <button
                  className="va-button-link"
                  onClick={this.handleStartOver}>
                  Start Over
                </button>
              </div>
            </div>
            <div
              className="search-schools">
              <button
                className="search-schools-button usa-button-primary"
                onClick={this.handleSearchClick}>
                {'Search Schools'}
              </button>
            </div>
          </div>
          <div
            aria-live="polite"
            aria-relevant="additions text">
            {showInstitutions && <div>
              {institutions.map(({ city, country, facilityCode, name, state, street }, index) => (
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
                      {name && <span className="institution-name">{name}</span>}
                      {street && <span className="institution-street">{street}</span>}
                      {(city || state) && <span className="institution-city-state">{`${city && city}${city && state && ', '}${state && state}`}</span>}
                      {!city && !state && <span className="institution-country">{country}</span>}
                    </label>
                  </div>
                </div>))
              }
            </div>
            }
            {showInstitutionsLoading && <div>
              <LoadingIndicator message={`Searching ${institutionQuery}...`}/>
            </div>
            }
            {showNoResultsFound && <div className="no-results-box">
              <p>
                <strong>
                  {'We can’t find your school'}
                </strong><br/>
                {'We’re sorry. We can’t find any school that matches your entry. Please try entering a different school name or address. Or, you can check the box to enter your school information yourself.'}
              </p>
            </div>}
            {showPaginationLoading && <div>
              <LoadingIndicator message={`Loading page ${currentPageNumber} results for ${institutionQuery}...`}/>
            </div>
            }
          </div>
          {showPagination && <Pagination
            page={currentPageNumber} pages={pagesCount} onPageSelect={this.handlePageSelect}/>
          }
        </div>
      </fieldset>
    );
  }
}

const mapStateToProps = (state, props) => {
  const currentPageNumber = selectCurrentPageNumber(state);
  const facilityCodeSelected = props.formData ? props.formData : '';
  const institutionQuery = selectInstitutionQuery(state);
  const institutions = selectInstitutions(state);
  const institutionSelected = selectInstitutionSelected(state);
  const pagesCount = selectPagesCount(state);
  const searchInputValue = selectSearchInputValue(state);
  const searchResultsCount = selectSearchResultsCount(state);
  const showInstitutions = selectShowInstitutions(state);
  const showInstitutionsLoading = selectShowInstitutionsLoading(state);
  const showNoResultsFound = selectShowNoResultsFound(state);
  const showPagination = selectShowPagination(state);
  const showPaginationLoading = selectShowPaginationLoading(state);

  return {
    currentPageNumber,
    facilityCodeSelected,
    institutionQuery,
    institutions,
    institutionSelected,
    pagesCount,
    searchInputValue,
    searchResultsCount,
    showInstitutions,
    showInstitutionsLoading,
    showNoResultsFound,
    showPagination,
    showPaginationLoading,
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
  facilityCodeSelected: React.PropTypes.string,
  institutionQuery: React.PropTypes.string,
  institutions: React.PropTypes.array,
  institutionSelected: React.PropTypes.string,
  pagesCount: React.PropTypes.number,
  searchInputValue: React.PropTypes.string,
  searchResultsCount: React.PropTypes.number,
  showInstitutions: React.PropTypes.bool.required,
  showInstitutionsLoading: React.PropTypes.bool.required,
  showNoResultsFound: React.PropTypes.bool.required,
  showPagination: React.PropTypes.bool.required,
  showPaginationLoading: React.PropTypes.bool.required
};

SchoolSelectField.defaultProps = {
  showInstitutions: false,
  showInstitutionsLoading: false,
  showNoResultsFound: false,
  showPagination: false,
  showPaginationLoading: false
};

export default connect(mapStateToProps, mapDispatchToProps)(SchoolSelectField);
