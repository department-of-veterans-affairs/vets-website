/* eslint-disable arrow-body-style */
// These are added in by Downshift so linting errors need to be ignored
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { connect } from 'react-redux';
import Downshift from 'downshift';
import classNames from 'classnames';
import { getProviderSvcs } from '../actions';

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
    const services = await this.props.getProviderSvcs();
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

  // eslint-disable-next-line prettier/prettier
  handleOnSelect = (selectedItem) => {
    const value = selectedItem ? selectedItem.specialtyCode.trim() : null;
    this.props.onSelect({
      target: { value },
    });
  };

  // eslint-disable-next-line prettier/prettier
  optionClasses = (selected) => classNames(
    'dropdown-option',
    { selected }
  )

  shouldShow = (input, svc) => {
    return (
      input.length >= 2 &&
      svc &&
      svc.name &&
      svc.name
        .trim()
        .toLowerCase()
        .includes(input.toLowerCase())
    );
  };

  render() {
    const { defaultSelectedItem, services } = this.state;
    // eslint-disable-next-line prettier/prettier
    const renderService = (s) => { return (s && s.name) ? s.name.trim() : ''; };

    return (
      <Downshift
        onChange={this.handleOnSelect}
        defaultSelectedItem={defaultSelectedItem}
        itemToString={renderService}
        onInputValueChange={(inputValue, stateAndHelpers) => {
          const { selectedItem, clearSelection } = stateAndHelpers;
          if (selectedItem && inputValue !== selectedItem.name.trim()) {
            clearSelection();
          }
        }}
        key={defaultSelectedItem}
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
            <label {...getLabelProps()}>Service type (optional)</label>
            <span id="service-typeahead">
              <input
                {...getInputProps({
                  placeholder: 'Like primary care, cardiology',
                })}
              />
              {isOpen && inputValue.length >= 2 ? (
                <div className="dropdown" role="listbox">
                  {services
                    .filter(svc => this.shouldShow(inputValue, svc))
                    .map((svc, index) => (
                      <div
                        key={svc.name}
                        {...getItemProps({
                          item: svc,
                          // eslint-disable-next-line prettier/prettier
                          className: this.optionClasses(index === highlightedIndex),
                          role: 'option',
                          'aria-selected': index === highlightedIndex,
                        })}
                        style={{
                          fontWeight: selectedItem === svc ? 'bold' : 'normal',
                        }}
                      >
                        {renderService(svc)}
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
  getProviderSvcs: func.isRequired,
  initialSelectedServiceType: string,
  onSelect: func.isRequired,
};

const mapDispatch = { getProviderSvcs };

export default connect(
  null,
  mapDispatch,
)(ServiceTypeAhead);
