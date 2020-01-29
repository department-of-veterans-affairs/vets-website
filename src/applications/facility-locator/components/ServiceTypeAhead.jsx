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
      pressedEnter: false,
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
                    if (event.key === 'Backspace' || event.key === 'Delete') {
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
              <div
                className={(() => {
                  if (isOpen && inputValue.length >= 2) {
                    return 'dropdown';
                  }
                  if (inputValue.length === 0) {
                    return 'dropdown bor-none';
                  }
                  return 'dropdown bor-none';
                })()}
                role="listbox"
              >
                {(() => {
                  const servicesFound = services.filter(svc =>
                    this.shouldShow(inputValue, svc),
                  );
                  if (servicesFound.length > 0) {
                    return services
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
                            fontWeight:
                              selectedItem === svc ? 'bold' : 'normal',
                          }}
                        >
                          {renderService(svc)}
                        </div>
                      ));
                  }
                  if (isOpen && inputValue.length >= 2) {
                    if (this.state.pressedEnter && inputValue.length >= 3) {
                      return (
                        <div
                          key={'not-found'}
                          {...getItemProps({
                            item: 'Not-Found',
                            className: 'dropdown-option',
                            role: 'option',
                          })}
                          style={{
                            fontWeight: 'normal',
                          }}
                        >
                          Service type not found
                        </div>
                      );
                    }
                  }
                  return null;
                })()}
              </div>
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
