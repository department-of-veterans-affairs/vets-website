import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { connect } from 'react-redux';
import Downshift from 'downshift';
import classNames from 'classnames';
import { getProviderSpecialties } from '../actions';
import { Error } from '../constants';

/**
 * CC Providers' Service Types Typeahead
 */
class ServiceTypeAhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      error: false,
      optionsFound: false,
      validationMessage: '',
      selectedService: null,
    };
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    this.getServices();
    document
      .getElementById('facility-search-controls')
      .addEventListener('submit', this.onSearch);
  }

  componentWillUnmount() {
    document
      .getElementById('facility-search-controls')
      .addEventListener('submit', this.onSearch);
  }

  onSearch() {
    if (!this.state.selectedService) {
      this.setState({
        error: true,
        validationMessage: Error.SERVICE_NOT_FOUND,
      });
    }
  }

  validateService(inputValue, event, selectedItem) {
    const servicesFound = Array.from(
      document.querySelectorAll('[id ^= "downshift-"]'),
    );
    if (event && event.key === 'Enter') {
      if (!inputValue || inputValue.length === 0) {
        this.setState({
          error: true,
          validationMessage: Error.INVALID_SERVICE,
        });
      } else if (
        inputValue &&
        inputValue.length > 2 &&
        servicesFound &&
        servicesFound.length === 0
      ) {
        this.setState({
          error: true,
          validationMessage: Error.SERVICE_NOT_FOUND,
        });
      } else if (servicesFound && servicesFound.length > 0 && !selectedItem) {
        this.setState({
          error: true,
          validationMessage: Error.SELECT_SERVICE,
        });
      }
    } else {
      this.setState({
        error: false,
      });
    }
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
    });
    this.setState({
      selectedService: value,
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

  render() {
    const { defaultSelectedItem, services } = this.state;
    return (
      <Downshift
        onChange={this.handleOnSelect}
        defaultSelectedItem={defaultSelectedItem}
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
          selectedItem,
        }) => (
          <div>
            <label {...getLabelProps()} htmlFor="service-type-ahead-input">
              Service type{' '}
              <span className="vads-u-color--secondary-dark">(*Required)</span>
              {this.state.error && (
                <span
                  className="usa-input-error-message"
                  role="alert"
                  id="text-service-error"
                >
                  <span className="sr-only">Error</span>{' '}
                  {this.state.validationMessage}
                </span>
              )}
            </label>
            <span id="service-typeahead">
              <input
                className={this.state.error ? 'validation-service-error' : null}
                {...getInputProps({
                  onKeyDown: event => {
                    this.validateService(inputValue, event, selectedItem);
                  },
                  placeholder: 'Like primary care, cardiology',
                })}
                id="service-type-ahead-input"
                required
              />
              {isOpen && inputValue.length >= 2 ? (
                <div className="dropdown" role="listbox">
                  {services
                    .filter(specialty => this.shouldShow(inputValue, specialty))
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
              ) : null}
            </span>
          </div>
        )}
      </Downshift>
    );
  }
}

ServiceTypeAhead.propTypes = {
  getProviderSpecialties: func.isRequired,
  initialSelectedServiceType: string,
  onSelect: func.isRequired,
};

const mapDispatch = { getProviderSpecialties };

export default connect(
  null,
  mapDispatch,
)(ServiceTypeAhead);
