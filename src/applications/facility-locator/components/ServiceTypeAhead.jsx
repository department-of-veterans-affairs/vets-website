/* eslint-disable no-use-before-declare */
/* eslint-disable react/sort-comp */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */

// These are added in by Downshift so linting error needs to be ignored
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import { func } from 'prop-types';
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
      services: []
    };
  }

  componentDidMount() {
    this.getServices();
  }

  getServices = async () => {
    const services = await this.props.getProviderSvcs();
    this.setState({ services });
  }

  handleOnSelect = (selectedItem) => {
    this.props.onSelect({
      target: {
        value: selectedItem.Name.trim()
      }
    });
  }

  optionClasses = (selected) => classNames(
    'dropdown-option',
    { selected }
  )

  shouldShow = (input, svc) => {
    return (input.length >= 2 && svc && svc.Name &&
      svc.Name.trim().toLowerCase().includes(input.toLowerCase()));
  }

  render() {
    const { services } = this.state;
    const renderService = (s) => { return (s && s.Name) ? s.Name.trim() : ''; };

    return (
      <Downshift onChange={this.handleOnSelect} itemToString={renderService}>
        {
          ({
            getInputProps,
            getItemProps,
            getLabelProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectedItem
          }) => (
            <div>
              <label { ...getLabelProps() }>
                Service type (optional)
              </label>
              <span id="service-typeahead">
                <input { ...getInputProps({ placeholder: 'Like primary care, cardiology' }) }/>
                { (isOpen && inputValue.length >= 2)
                  ? <div className="dropdown" role="listbox">
                      { services
                        .filter(svc => this.shouldShow(inputValue, svc))
                        .map((svc, index) => (
                          <div key={svc.Name}
                            { ...getItemProps({
                                item: svc,
                                className: this.optionClasses(index === highlightedIndex),
                                role: 'option',
                                'aria-selected': index === highlightedIndex
                              })
                            }
                            style={{ fontWeight: selectedItem === svc ? 'bold' : 'normal' }}>
                            {renderService(svc)}
                          </div>
                        ))
                      }
                    </div>
                  : null
                }
              </span>
            </div>
          )
        }
      </Downshift>
    );

  }
}

ServiceTypeAhead.propTypes = {
  onSelect: func.isRequired,
  getProviderSvcs: func.isRequired,
};

const mapDispatch = { getProviderSvcs };

export default connect(null, mapDispatch)(ServiceTypeAhead);
