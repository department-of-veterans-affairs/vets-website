import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Pagination from '@department-of-veterans-affairs/formation/Pagination';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import Scroll from 'react-scroll';
import {
  fetchInstitutions,
  transformInstitutionsForSchoolSelectField
} from '../complaint-tool/helpers';

const fetchAndTransformInstitutions = ({ institutionQuery, page }) => fetchInstitutions({ institutionQuery, page })
  .then(({ error, payload }) => transformInstitutionsForSchoolSelectField({ error, institutionQuery, payload }));
const Element = Scroll.Element;
const scroller = Scroll.scroller;

export default class SchoolSelectField extends React.Component {
  constructor(props) {
    super(props);

    this.debouncedSearchInstitutions = _.debounce(
      value => fetchAndTransformInstitutions(value).then(this.setInstitutions),
      150);

    this.state = {
      facilityCodeSelected: props.formData ? props.formData : '',
      loadingInstitutions: false,
      loadingPage: false,
      page: 1,
      pages: 0,
      searchInputValue: '',
      showInstitutions: false,
      showPagination: false
    };
  }

  setInstitutions = ({ institutionCount, institutionQuery, institutions, pagesCount }) => {
    if (institutionQuery === this.state.institutionQuery) {
      this.setState({
        loadingInstitutions: false,
        loadingPage: false,
        showInstitutions: true,
        institutionCount,
        institutions,
        pagesCount,
        showPagination: pagesCount > 1
      });
    }
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

      this.setState({
        loadingInstitutions: true,
        loadingPage: false,
        page: 1,
        pageCount: 0,
        institutionQuery: this.state.searchInputValue,
        showInstitutions: false,
        showPagination: false
      });

      this.debouncedSearchInstitutions({ institutionQuery: this.state.searchInputValue });
    }
  }

  handleSearchClick = e => {
    e.preventDefault();
    this.setState({
      loadingInstitutions: true,
      loadingPage: false,
      page: 1,
      pageCount: 0,
      institutionQuery: this.state.searchInputValue,
      showInstitutions: false,
      showPagination: false
    });

    this.debouncedSearchInstitutions({ institutionQuery: this.state.searchInputValue });
  }

  handleSearchInputChange = e => {
    let searchInputValue;
    if (typeof (e) === 'string') {
      searchInputValue = e;
    } else {
      searchInputValue = e.target.value;
    }
    this.setState({
      searchInputValue
    });
  }

  handleOptionClick = facilityCode => {
    this.props.onChange(facilityCode);

    this.setState({
      facilityCodeSelected: facilityCode
    });
  }

  handlePageSelect = page => {
    this.scrollToTop();

    this.setState({
      loadingInstitutions: false,
      loadingPage: true,
      page,
      pageCount: 0,
      showInstitutions: false,
      showPagination: false
    });

    this.debouncedSearchInstitutions({
      institutionQuery: this.state.institutionQuery,
      page
    });
  }
  render() {
    const {
      formContext
    } = this.props;
    /*
    const fieldsetClass = classNames('fieldset-input', {
      'usa-input-error': this.props.errorMessage,
      [this.props.additionalFieldsetClass]: this.props.additionalFieldsetClass
    });

    const legendClass = classNames('legend-label', {
      'usa-input-error-label': this.props.errorMessage,
      [this.props.additionalLegendClass]: this.props.additionalLegendClass
    });
    */

    const fieldsetClass = classNames('search-select-school-fieldset');
    const legendClass = classNames('legend-label');

    if (formContext.reviewMode) {
      return (<div>To do</div>);
    }

    return (
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>
          {'Search school names'}
        </legend>
        <div>
          <div className="search-controls">
            <Element name="schoolSearch"/>
            <input
              onChange={this.handleSearchInputChange}
              onKeyDown={this.handleSearchInputKeyDown}
              type="text"
              value={this.state.searchInputValue}/>
            <button
              className="search-schools-button usa-button-primary"
              onClick={this.handleSearchClick}>
              {'Search Schools'}
            </button>
          </div>
          {this.state.showInstitutions && <div>
            {`${this.state.institutionCount} results for ${this.state.institutionQuery}`}
            {this.state.institutions.map(({ city, facilityCode, name, state }, index) => (
              <div key={index}>
                <div className="radio-button">
                  <input
                    autoComplete="false"
                    checked={this.state.facilityCodeSelected === facilityCode}
                    id={`radio-buttons-${index}`}
                    name={name}
                    type="radio"
                    onKeyDown={this.props.onKeyDown}
                    onChange={() => this.handleOptionClick(facilityCode)}
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
          {this.state.loadingInstitutions && <div>
            <LoadingIndicator message={`Searching ${this.state.institutionQuery}...`}/>
          </div>
          }
          {this.state.loadingPage && <div>
            <LoadingIndicator message={`Loading page ${this.state.page} results for ${this.state.institutionQuery}...`}/>
          </div>
          }
        </div>
        {this.state.showPagination && <Pagination
          page={this.state.page} pages={this.state.pagesCount} onPageSelect={this.handlePageSelect}/>
        }
      </fieldset>
    );
  }
}
