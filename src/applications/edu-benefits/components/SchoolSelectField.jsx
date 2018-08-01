import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Pagination from '@department-of-veterans-affairs/formation/Pagination';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import Scroll from 'react-scroll';
import { connect } from 'react-redux';
import {
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

  scrollToTop = () => {
    scroller.scrollTo('schoolSearch', {
      duration: 250,
      delay: 0,
      smooth: true
    });
  };

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
    if (typeof (e) === 'string') {
      searchInputValue = e;
    } else {
      searchInputValue = e.target.value;
    }

    this.props.searchInputChange({ searchInputValue });
  }

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
            <input
              onChange={this.handleSearchInputChange}
              onKeyDown={this.handleSearchInputKeyDown}
              type="text"
              value={searchInputValue}/>
            <button
              className="search-schools-button usa-button-primary"
              onClick={this.handleSearchClick}>
              {'Search Schools'}
            </button>
          </div>
          {showInstitutions && <div>
            {`${searchResultsCount} results for ${institutionQuery}`}
            {institutions.map(({ city, facilityCode, name, state }, index) => (
              <div key={index}>
                <div className="radio-button">
                  <input
                    autoComplete="false"
                    checked={facilityCodeSelected === facilityCode}
                    id={`radio-buttons-${index}`}
                    name={name}
                    type="radio"
                    onKeyDown={this.onKeyDown}
                    onChange={() => this.handleOptionClick({ city, facilityCode, name, state })}
                    value={facilityCode}/>
                  <label
                    id={`institution-${index}-label`}
                    htmlFor={`radio-buttons-${index}`}>
                    <span className="institution-name">{name}</span>
                    <span className="institution-city-state">{`${city}, ${state}`}</span>
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
              <strong>{'No schools found. '}</strong>{'Please try entering a different search term (school name or address), or '}<a onClick={this.handleManuallyEnterClicked}>{'manually enter your school’s information by clicking this link.'}</a>
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
    showPagination,
    showPaginationLoading,
  };
};
const mapDispatchToProps = {
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
  showNoResultsFound: true,
  showPagination: false,
  showPaginationLoading: false
};

export default connect(mapStateToProps, mapDispatchToProps)(SchoolSelectField);
