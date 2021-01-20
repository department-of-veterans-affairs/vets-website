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
        }) => (
          <div>
            <label {...getLabelProps()} htmlFor="service-type-ahead-input">
              Service type{' '}
              <span className="vads-u-color--secondary-dark">(*Required)</span>
            </label>
            <span id="service-typeahead">
              <input
                {...getInputProps({
                  placeholder: 'like Chiropractor or Optometrist',
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
