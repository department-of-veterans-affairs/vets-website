import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Downshift from 'downshift';
import { getProviderSpecialties } from '../actions';
import classNames from 'classnames';
import MessagePromptDiv from './MessagePromptDiv';

const MIN_SEARCH_CHARS = 2;
/**
 * CC Providers' Service Types Typeahead
 */
class ServiceTypeAhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      isFocused: false,
    };
  }

  componentDidMount() {
    this.getServices();
  }

  getServices = async () => {
    const services = await this.props.getProviderSpecialties();
    this.setState({
      services,
      defaultSelectedItem:
        this.props.initialSelectedServiceType &&
        services.find(
          ({ specialtyCode }) =>
            specialtyCode === this.props.initialSelectedServiceType,
        ),
    });
  };

  handleOnSelect = selectedItem => {
    const value = selectedItem ? selectedItem.specialtyCode.trim() : null;
    this.props.handleServiceTypeChange({
      target: { value },
      selectedItem,
    });
  };

  optionClasses = selected => classNames('dropdown-option', { selected });

  getSpecialtyName = specialty => {
    if (!specialty) return '';

    return specialty.name;
  };

  shouldShow = (input, specialty) => {
    if (!specialty) {
      return false;
    }
    const specialtyName = this.getSpecialtyName(specialty);
    if (input.length >= 2 && specialtyName) {
      return specialtyName
        .trim()
        .toLowerCase()
        .includes(input.toLowerCase());
    }
    return false;
  };

  matchingServices = inputValue => {
    if (inputValue) {
      return this.state.services.filter(specialty =>
        this.shouldShow(inputValue, specialty),
      );
    } else return null;
  };

  renderSearchForAvailableServicePrompt = inputValue => {
    const { isFocused } = this.state;
    const { showError } = this.props;
    if (
      (isFocused && inputValue === '' && !showError) ||
      (inputValue && inputValue.length < MIN_SEARCH_CHARS)
    ) {
      return (
        <MessagePromptDiv
          message="Search for an available service"
          id="search-available-service-prompt"
        />
      );
    } else return null;
  };

  renderServiceTypeDropdownOptions = (
    getItemProps,
    highlightedIndex,
    inputValue,
  ) => {
    return (
      <div className="dropdown" role="listbox">
        {this.matchingServices(inputValue).map((specialty, index) => (
          <div
            key={this.getSpecialtyName(specialty)}
            {...getItemProps({
              item: specialty,
              className: this.optionClasses(index === highlightedIndex),
              role: 'option',
              'aria-selected': index === highlightedIndex,
            })}
          >
            {this.getSpecialtyName(specialty)}
          </div>
        ))}
      </div>
    );
  };

  renderTryAnotherServicePrompt = inputValue => {
    if (
      inputValue &&
      inputValue.length >= 2 &&
      !this.matchingServices(inputValue).length
    ) {
      return (
        <MessagePromptDiv
          message="We couldn't find that, please try another service"
          id="could-not-find-service-prompt"
          waitBeforeShow={2000}
        />
      );
    } else return null;
  };

  render() {
    const { defaultSelectedItem } = this.state;
    const { showError, currentQuery, handleServiceTypeChange } = this.props;
    return (
      <Downshift
        onChange={this.handleOnSelect}
        selectedItem={!window.Cypress ? defaultSelectedItem : undefined}
        defaultSelectedItem={window.Cypress ? defaultSelectedItem : undefined}
        defaultInputValue=""
        itemToString={this.getSpecialtyName}
        onInputValueChange={inputValue => {
          if (
            currentQuery.serviceType &&
            inputValue !== currentQuery.specialties[currentQuery.serviceType]
          ) {
            handleServiceTypeChange({
              target: { value: '' },
              selectedItem: null,
            });
          }
        }}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div
            id="service-error"
            className={classNames('vads-u-margin--0', {
              'usa-input-error': showError,
            })}
          >
            <label {...getLabelProps()} htmlFor="service-type-ahead-input">
              Service type{' '}
              <span className="form-required-span">(*Required)</span>
            </label>
            {showError && (
              <span className="usa-input-error-message" role="alert">
                <span id="error-message">
                  <span className="sr-only">Error</span>
                  Please search for an available service.
                </span>
              </span>
            )}
            <span id="service-typeahead">
              <input
                {...getInputProps({
                  placeholder: 'like Chiropractor or Optometrist',
                  onFocus: () => this.setState({ isFocused: true }),
                  disabled: currentQuery?.fetchSvcsInProgress,
                })}
                onBlur={() => {
                  this.setState({ isFocused: false });
                }}
                id="service-type-ahead-input"
                aria-describedby="could-not-find-service-prompt error-message"
              />

              {this.renderSearchForAvailableServicePrompt(inputValue)}
              {isOpen &&
                inputValue &&
                inputValue.length >= MIN_SEARCH_CHARS &&
                this.renderServiceTypeDropdownOptions(
                  getItemProps,
                  highlightedIndex,
                  inputValue,
                )}
              {this.renderTryAnotherServicePrompt(inputValue)}
            </span>
          </div>
        )}
      </Downshift>
    );
  }
}

ServiceTypeAhead.propTypes = {
  getProviderSpecialties: PropTypes.func.isRequired,
  initialSelectedServiceType: PropTypes.string,
  handleServiceTypeChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  showError: PropTypes.bool,
};

const mapDispatch = { getProviderSpecialties };

const mapStateToProps = state => {
  return {
    currentQuery: state.searchQuery,
  };
};

export default connect(
  mapStateToProps,
  mapDispatch,
)(ServiceTypeAhead);
