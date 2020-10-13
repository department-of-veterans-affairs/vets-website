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
    if (selectedItem === 'not-found') return;
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
    if (!specialty || !input) {
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

  renderSpecialtiesOptions(
    isOpen,
    inputValue,
    services,
    getItemProps,
    highlightedIndex,
    selectedItem,
  ) {
    const servicesFound = services.filter(svc =>
      this.shouldShow(inputValue, svc),
    );

    if (servicesFound.length > 0 && !selectedItem) {
      return (
        <div className="dropdown" role="listbox">
          {services
            .filter(svc => this.shouldShow(inputValue, svc))
            .map((svc, index) => (
              <div
                key={svc.name + Date.now()}
                {...getItemProps({
                  item: svc,
                  className: this.optionClasses(index === highlightedIndex),
                  role: 'option',
                  'aria-selected': index === highlightedIndex,
                })}
              >
                {this.getSpecialtyName(svc)}
              </div>
            ))}
        </div>
      );
    }
    if (
      isOpen &&
      services.length > 0 &&
      inputValue.length >= 2 &&
      this.state.pressedEnter
    ) {
      return (
        <div className="dropdown" role="listbox">
          <div
            key="not-found"
            {...getItemProps({
              item: 'not-found',
              className: 'dropdown-option',
              role: 'option',
            })}
          >
            We're sorry. This service type was not found.
          </div>
        </div>
      );
    }
    return null;
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
                    }
                    if (this.state.pressedEnter) {
                      this.setState({
                        pressedEnter: false,
                      });
                    }
                  },
                  placeholder: 'Like primary care, cardiology',
                })}
                id="service-type-ahead-input"
                required
              />
              {this.renderSpecialtiesOptions(
                isOpen,
                inputValue,
                services,
                getItemProps,
                highlightedIndex,
                selectedItem,
              )}
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
