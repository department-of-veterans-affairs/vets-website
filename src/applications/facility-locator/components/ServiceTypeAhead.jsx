import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { connect } from 'react-redux';
import Downshift from 'downshift';
import classNames from 'classnames';
import { getProviderSpecialties } from '../actions';

/**
 * CC Providers' Service Types Typeahead
 */
class ServiceTypeAhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      pressedEnter: false,
    };
  }

  componentDidMount() {
    this.getServices();
    document
      .getElementById('service-type-ahead-input')
      .setCustomValidity('Please enter a valid Service type.');
  }

  validateServiceTypeAhead(inputID, inputValue, event) {
    const input = document.getElementById(inputID);
    const validityState = input.validity;
    const serviceList = Array.from(
      document.querySelectorAll('[id ^= "downshift-"]'),
    ).filter(el => el.key !== 'not-found');
    if (validityState.valueMissing && inputValue.length === 0) {
      input.setCustomValidity('Please enter a valid Service type.');
      input.reportValidity();
    } else if (event.key === 'Enter' && serviceList.length > 2) {
      input.setCustomValidity('Please select an item from the list');
      input.reportValidity();
    } else {
      input.setCustomValidity('');
      input.reportValidity();
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
    if (selectedItem && selectedItem === 'not-found') return;
    const value = selectedItem ? selectedItem.specialtyCode.trim() : null;
    this.props.onSelect({
      target: { value },
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

  renderOptions(getItemProps, servicesFound, highlightedIndex) {
    if (servicesFound.length > 0) {
      return servicesFound.map((svc, index) => (
        <div
          key={svc.name}
          {...getItemProps({
            item: svc,
            className: this.optionClasses(index === highlightedIndex),
            role: 'option',
            'aria-selected': index === highlightedIndex,
          })}
        >
          {this.getSpecialtyName(svc)}
        </div>
      ));
    }
    return (
      <div
        key={'not-found'}
        {...getItemProps({
          item: 'not-found',
          className: 'dropdown-option',
          role: 'option',
        })}
      >
        We're sorry. This service type was not found.
      </div>
    );
  }

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
            </label>
            <span id="service-typeahead">
              <input
                {...getInputProps({
                  onKeyDown: event => {
                    if (event.key === 'Enter') {
                      this.setState({
                        pressedEnter: true,
                      });
                    } else {
                      this.setState({
                        pressedEnter: false,
                      });
                    }

                    this.validateServiceTypeAhead(
                      'service-type-ahead-input',
                      inputValue,
                      event,
                    );
                  },
                  placeholder: 'Like primary care, cardiology',
                })}
                id="service-type-ahead-input"
                required
              />
              {isOpen && inputValue.length >= 2 ? (
                <div className="dropdown" role="listbox">
                  {(() => {
                    const servicesFound = services.filter(svc =>
                      this.shouldShow(inputValue, svc),
                    );
                    if (servicesFound.length > 0 && !selectedItem) {
                      return this.renderOptions(
                        getItemProps,
                        servicesFound,
                        highlightedIndex,
                      );
                    }
                    if (this.state.pressedEnter && services.length > 0) {
                      return this.renderOptions(
                        getItemProps,
                        servicesFound,
                        highlightedIndex,
                      );
                    }
                    return null;
                  })()}
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
