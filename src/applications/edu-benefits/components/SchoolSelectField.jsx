import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

export default class PhotoField extends React.Component {
  constructor(props) {
    super(props);

    const uiOptions = props.uiSchema['ui:options'].school;
    const {
      fetchInstitutions
    } = _.get(props, 'uiSchema.ui:options.schoolSelect', props);

    this.debouncedSearchInstitutions = _.debounce(
      value => fetchInstitutions(value).then(this.setInstitutions),
      150);

    this.state = {
      searchInputValue: 'CA'
    };

    this.debouncedSearchInstitutions({ institutionQuery: 'CA' });

  }

  handleOptionClick = facilityCode => {
    this.setState({
      facilityCodeSelected: facilityCode
    });
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

  handleSearchClick = e => {
    e.preventDefault();
    this.setState({
      loadingInstitutions: true,
      showInstitutions: false
    });

    this.debouncedSearchInstitutions({ institutionQuery: this.state.searchInputValue });
  }

  handleSearchInputKeyUp = e => {
    if ((e.which || e.keyCode) === 13) {
      e.preventDefault();
      e.target.blur();

      this.setState({
        loadingInstitutions: true,
        showInstitutions: false
      });

      this.debouncedSearchInstitutions({ institutionQuery: this.state.searchInputValue });
    }
  }

  setInstitutions = ({ institutionCount, institutionQuery, institutions, links })=> {
    if (institutionQuery === this.state.searchInputValue) {
      this.setState({
        loadingInstitutions: false,
        showInstitutions: true,
        institutionCount,
        institutions
      });
    }
  }

  render() {
    console.log(this.state);
    const test = this.state.institutions && this
      .state
      .institutions
      .map(({ city, country, name, state, zip }) => ({
        label: name,
        value: name,
        addtional: (<div key={name}>
          <p>{name}</p>
          <p>{city}</p>
          <p>{state}</p>
        </div>)
      }));

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

    const fieldsetClass = classNames('fieldset-input');
    const legendClass = classNames('legend-label');

    return (
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>
          {'Select a school'}
        </legend>
        <div>
          <input
            onChange={this.handleSearchInputChange}
            onKeyDown={this.handleSearchInputKeyUp}
            type="text"
            value={this.state.searchInputValue}
          />
          <button
            onClick={this.handleSearchClick}>
            {'Search Schools'}
          </button>
          {this.state.showInstitutions &&

              this.state.institutions.map(({ city, country, facilityCode, name, state, zip }, index) => (
                <div key={index}>
                  <div className="errorable-radio-button">
                    <input
                      autoComplete="false"
                      checked={this.state.facilityCodeSelected === facilityCode}
                      id={`radio-buttons-${index}`}
                      name={name}
                      type="radio"
                      onMouseDown={() => this.handleOptionClick(facilityCode)}
                      onKeyDown={this.props.onKeyDown}
                      value={facilityCode}
                      onChange={this.handleChange}/>

                    <label
                      name={`institution-name-${index}-label`}
                      onMouseDown={() => this.handleOptionClick(facilityCode)}
                      htmlFor={`radio-buttons-${index}`}>
                      {name}
                    </label>
                    <label
                      name={`institution-city-${index}-label`}
                      onMouseDown={() => this.handleOptionClick(facilityCode)}
                      htmlFor={`radio-buttons-${index}`}>
                      {city}
                    </label>
                    <label
                      name={`institution-state-${index}-label`}
                      onMouseDown={() => this.handleOptionClick(facilityCode)}
                      htmlFor={`radio-buttons-${index}`}>
                      {state}
                    </label>
                  </div>

                </div>))}
                {/*this.state.showInstitutions &&
            <ErrorableRadioButtons
              options={this
                  .state
                  .institutions
                  .map(({ city, country, name, state, zip }) => ({
                    value: name,
                    addtional: (<div key={name}>
                      <p>{name}</p>
                      <p>{city}</p>
                      <p>{state}</p>
                    </div>)
                  }))}
            value={{ value: ''}}/>
            */}
          </div>
        </fieldset>
    );
  }
}
