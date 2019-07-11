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

  handleOnSelect = selectedItem => {
    const value = selectedItem ? selectedItem.specialtyCode.trim() : null;
    this.props.onSelect({
      target: { value },
    });
  };

  optionClasses = selected => classNames('dropdown-option', { selected });

  shouldShow = (input, svc) =>
    input.length >= 2 &&
    svc &&
    svc.name &&
    svc.name
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());

  render() {
    const { defaultSelectedItem, services } = this.state;
    const renderService = s => (s && s.name ? s.name.trim() : '');

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
            <label {...getLabelProps()} htmlFor="service-type-ahead-input">
              Service type{' '}
              <span className="vads-u-color--secondary-dark">(*Required)</span>
            </label>
            <span id="service-typeahead">
              <input
                {...getInputProps({
                  placeholder: 'Like primary care, cardiology',
                })}
                id="service-type-ahead-input"
                required
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
                          className: this.optionClasses(
                            index === highlightedIndex,
                          ),
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
