import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Downshift from 'downshift';
import { getProviderSpecialties } from '../actions';
import classNames from 'classnames';
// import environment from 'platform/utilities/environment';

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
    this.props.onSelect({
      target: { value },
      selectedItem,
    });
  };

  optionClasses = selected => classNames('dropdown-option', { selected });

  getSpecialtyName = specialty => {
    if (!specialty) return null;

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

  renderSearchForAvailableServicePrompt = inputValue => {
    const { isFocused } = this.state;
    const { showError } = this.props;

    if (
      (isFocused && !inputValue && !showError) ||
      (inputValue && inputValue.length < 2)
    ) {
      return (
        <div className="dropdown" role="alert">
          <div className="vads-u-margin--1p5">
            {'Search for an available service'}
          </div>
        </div>
      );
    } else return null;
  };

  renderTryAnotherServicePrompt = inputValue => {
    const { services } = this.state;

    if (
      inputValue &&
      inputValue.length >= 2 &&
      !services.filter(specialty => this.shouldShow(inputValue, specialty))
        .length
    ) {
      return (
        <div className="dropdown" role="alert">
          <div className="vads-u-margin--1p5">
            {"We couldn't find that, please try another service"}
          </div>
        </div>
      );
    } else return null;
  };

  render() {
    const { defaultSelectedItem, services } = this.state;
    const { showError } = this.props;

    return (
      <Downshift
        onChange={this.handleOnSelect}
        selectedItem={!window.Cypress ? defaultSelectedItem : undefined}
        defaultSelectedItem={window.Cypress ? defaultSelectedItem : undefined}
        itemToString={this.getSpecialtyName}
        onInputValueChange={(inputValue, stateAndHelpers) => {
          const { selectedItem, clearSelection } = stateAndHelpers;
          if (
            selectedItem &&
            inputValue !== this.getSpecialtyName(selectedItem)
          ) {
            clearSelection();
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
                <span className="sr-only">Error</span>
                Please search for an available service.
              </span>
            )}
            <span id="service-typeahead">
              <input
                {...getInputProps({
                  placeholder: 'like Chiropractor or Optometrist',
                  onFocus: () => this.setState({ isFocused: true }),
                  onBlur: e => {
                    this.setState({ isFocused: false });
                    this.props.onBlur(e);
                  },
                })}
                id="service-type-ahead-input"
              />

              {this.renderSearchForAvailableServicePrompt(inputValue)}
              {this.renderTryAnotherServicePrompt(inputValue)}

              {isOpen &&
                inputValue &&
                inputValue.length >= 2 && (
                  <div className="dropdown" role="listbox">
                    {services
                      .filter(specialty =>
                        this.shouldShow(inputValue, specialty),
                      )
                      .map((specialty, index) => (
                        <div
                          key={this.getSpecialtyName(specialty)}
                          {...getItemProps({
                            item: specialty,
                            className: this.optionClasses(
                              index === highlightedIndex,
                            ),
                            role: 'option',
                            'aria-selected': index === highlightedIndex,
                          })}
                        >
                          {this.getSpecialtyName(specialty)}
                        </div>
                      ))}
                  </div>
                )}
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
  onSelect: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  showError: PropTypes.bool,
};

const mapDispatch = { getProviderSpecialties };

export default connect(
  null,
  mapDispatch,
)(ServiceTypeAhead);
