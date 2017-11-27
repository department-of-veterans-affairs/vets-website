import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { truncate, kebabCase } from 'lodash';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';
import classNames from 'classnames';
import { benefitsServices, facilityTypes, vetCenterServices } from '../config';


class SearchControls extends Component {

  constructor() {
    super();

    this.state = {
      facilityDropdownActive: false,
      serviceDropdownActive: false,
      facilityDropdownFocused: false,
      serviceDropdownFocused: false,
      focusedFacilityIndex: -1,
      focusedServiceIndex: -1
    };
    this.services = [];
    this.facilities = [];
    this.toggleFacilityDropdown = this.toggleFacilityDropdown.bind(this);
    this.toggleServiceDropdown = this.toggleServiceDropdown.bind(this);
    this.handleFacilityFilterSelect = this.handleFacilityFilterSelect.bind(this);
    this.handleKeyInput = this.handleKeyInput.bind(this);
    this.focusSelectOption = this.focusSelectOption.bind(this);
  }

  // TODO (bshyong): generalize to be able to handle Select box changes
  handleQueryChange = (e) => {
    this.props.onChange({
      searchString: e.target.value,
    });
  }

  handleServiceFilterSelect(serviceType) {
    if (serviceType === 'All') {
      this.props.updateSearchQuery({
        serviceType: null,
      });
    } else {
      this.props.updateSearchQuery({
        serviceType,
      });
    }
  }

  handleSearch = (e) => {
    const { onSearch } = this.props;
    e.preventDefault();

    const { facilityType } = this.props.currentQuery;
    // Report event here to only send analytics event when a user clicks on the button
    window.dataLayer.push({
      event: 'fl-search',
      'fl-search-fac-type': facilityType
    });

    onSearch();
  }

  handleEditSearch = () => {
    this.props.updateSearchQuery({
      active: false,
    });
  }

  toggleFacilityDropdown() {
    this.setState({
      facilityDropdownActive: !this.state.facilityDropdownActive,
      serviceDropdownActive: false,
    });
  }

  toggleServiceDropdown() {
    const { currentQuery: { facilityType } } = this.props;
    if (['benefits', 'vet_center'].includes(facilityType)) {
      this.setState({
        serviceDropdownActive: !this.state.serviceDropdownActive,
        facilityDropdownActive: false,
      });
    }
  }

  handleFacilityFilterSelect(newFacilityType) {
    const { currentQuery: { facilityType } } = this.props;
    if (['benefits', 'vet_center'].includes(newFacilityType) &&
        newFacilityType === facilityType) {
      return () => {
        this.props.updateSearchQuery({
          facilityType: newFacilityType,
        });
      };
    }
    return () => {
      this.props.updateSearchQuery({
        facilityType: newFacilityType,
        serviceType: null,
      });
    };
  }

  focusSelectOption(node) {
    if (node) {
      node.focus();
    }
  }

  handleKeyInput(e) {
    const { currentQuery } = this.props;

    function isTraverse(code) {
      return code === 38 || code === 40;
    }

    function isEscape(code) {
      return (code === 27) || (code === 9);
    }

    function isToggle(code, isActive) {
      const shouldOpen = isTraverse(code);
      const shouldClose = isEscape(code);
      if (shouldOpen && !isActive) return 'open';
      if (shouldClose && isActive) return 'close';
      return false;
    }

    function isSelect(code) {
      return code === 13;
    }

    if (document.activeElement.id === 'serviceDropdown') {
      if (e.keyCode === 9) {
        return this.setState({ serviceDropdownFocused: true, facilityDropdownActive: false, facilityDropdownFocused: false });
      }
      if (isToggle(e.keyCode, this.state.serviceDropdownActive) && this.state.serviceDropdownActive) {
        return this.toggleServiceDropdown();
      } else if (isToggle(e.keyCode, this.state.serviceDropdownActive) && !this.state.serviceDropdownActive) {
        this.toggleServiceDropdown();
        this.focusSelectOption(this.services[this.state.focusedServiceIndex]);
        return this.setState({ serviceDropdownFocused: true });
      } else if (isTraverse(e.keyCode) && this.state.serviceDropdownFocused) {
        const difference = e.keyCode === 40 ? 1 : -1;
        const index = this.state.focusedServiceIndex + difference;
        if (this.services[index]) {
          this.focusSelectOption(this.services[index]);
          return this.setState({ focusedServiceIndex: index });
        }
      } else if (isSelect(e.keyCode)) {
        if (this.state.serviceDropdownActive) {
          return this.handleServiceFilterSelect(this.services[this.state.focusedServiceIndex].innerText.toLowerCase());
        }
      }
    } else if (document.activeElement.id === 'facilityDropdown') {
      if (e.keyCode === 9) {
        return this.setState({ facilityDropdownFocused: true, serviceDropdownActive: false, serviceDropdownFocused: false });
      }
      if (isToggle(e.keyCode, this.state.facilityDropdownActive) === 'close') {
        return this.toggleFacilityDropdown();
      } else if (isToggle(e.keyCode, this.state.facilityDropdownActive) === 'open') {
        this.toggleFacilityDropdown();
        this.focusSelectOption(this.facilities[this.state.focusedFacilityIndex]);
        return this.setState({ facilityDropdownFocused: true });
      } else if (isTraverse(e.keyCode) && this.state.facilityDropdownFocused) {
        const difference = e.keyCode === 40 ? 1 : -1;
        let selectionIndex;
        if (currentQuery.facilityType) {
          const selection = this.state.facilities.filter(facility => facility.textContent.toLowerCase() === currentQuery.facilityType);
          selectionIndex = this.state.facilities.indexOf(selection);
        }
        const index = (selectionIndex || this.state.focusedFacilityIndex) + difference;
        if (this.facilities[index]) {
          this.focusSelectOption(this.facilities[index]);
          return this.setState({ focusedFacilityIndex: index });
        }
      } else if (isSelect(e.keyCode)) {
        if (this.state.facilityDropdownActive) {
          this.toggleFacilityDropdown();
          const newFacilityType = this.facilities[this.state.focusedFacilityIndex].innerText.toLowerCase();
          this.handleFacilityFilterSelect(newFacilityType)();
        }
      }
    } else if (isEscape(e.keyCode) && document.activeElement.id !== 'facilityDropdown' && document.activeElement.id !== 'serviceDropdown') {
      return this.setState({
        serviceDropDownActive: false,
        facilityDropdownActive: false,
        serviceDropDownFocused: false,
        facilityDropdownFocused: false,
        focusedServiceIndex: currentQuery.serviceType || 0,
        focusedFacilityIndex: currentQuery.facilityType || 0
      });
    }
    return true;
  }

  renderServiceFilterOptions() {
    const { currentQuery: { facilityType } } = this.props;
    let services;

    switch (facilityType) {
      case 'benefits':
        services = Object.keys(benefitsServices);
        break;
      case 'vet_center':
        services = ['All', ...vetCenterServices];
        break;
      default:
        return null;
    }

    return (
      <ul className="dropdown">
        {
          services.map((k, i) => {
            return (<li ref={ elem => { this.services[i] = elem; }} className={`${this.state.focusedServiceIndex === i ? 'is-hovered' : ''}`} key={k} value={k}>
              <button tabIndex="-1" id={k} type="button" className="facility-option" onClick={this.handleServiceFilterSelect.bind(this, k)}>
                <span className="flex-center">
                  <span className="legend spacer"></span>
                  {benefitsServices[k] || k}
                </span>
              </button>
            </li>);
          })
        }
      </ul>
    );
  }

  renderSelectOptionWithIcon(facilityType) {
    if (facilityType) {
      return (
        <button tabIndex="-1" id={facilityType} type="button" className="facility-option">
          <span className="flex-center"><span className={`legend ${kebabCase(facilityType)}-icon`}></span>{facilityTypes[facilityType]}</span>
        </button>
      );
    }

    return (
      <button tabIndex="-1" id="facilityDropdown" type="button" className="facility-option">
        <span className="flex-center all-facilities"><span className="legend spacer"></span>All Facilities</span>
      </button>
    );
  }

  renderServiceSelectOption(serviceType) {
    const { isMobile } = this.props;

    return (
      <div className="flex-center">
        <button id="serviceDropdown" type="button" className="facility-option">
          <span className="flex-center">
            <span className="legend spacer"></span>
            {truncate((benefitsServices[serviceType] || serviceType || 'All'), { length: (isMobile ? 38 : 27) })}
          </span>
        </button>
      </div>
    );
  }

  render() {
    const { currentQuery, isMobile } = this.props;
    const { facilityDropdownActive, serviceDropdownActive, serviceDropdownFocused } = this.state;

    if (currentQuery.active && isMobile) {
      return (
        <div className="search-controls-container">
          <button className="small-12" onClick={this.handleEditSearch}>
            Edit Search
          </button>
        </div>
      );
    }

    const serviceDropdownClasses = classNames({
      'facility-dropdown-wrapper': true,
      active: serviceDropdownActive,
      'is-focused': serviceDropdownFocused,
      disabled: !['benefits', 'vet_center'].includes(currentQuery.facilityType),
    });

    return (
      <div className="search-controls-container clearfix">
        <form>
          <div className="columns usa-width-one-third medium-4" >
            <label htmlFor="streetCityStateZip">Enter Street, City, State or Zip</label>
            <input ref="searchField" name="streetCityStateZip" type="text" onChange={this.handleQueryChange} value={currentQuery.searchString} aria-label="Street, City, State or Zip" title="Street, City, State or Zip"/>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="facilityType">Select Facility Type</label>
            <div onKeyUp={this.handleKeyInput} tabIndex="0" id="facilityDropdown" className={`facility-dropdown-wrapper ${this.state.facilityDropdownFocused ? 'is-focused' : ''} ${facilityDropdownActive ? 'active' : ''}`} aria-controls="expandable" aria-expanded="false" role="combobox" onClick={this.toggleFacilityDropdown}>
              <div className="flex-center">
                {this.renderSelectOptionWithIcon(currentQuery.facilityType)}
              </div>
              <ul role="listbox" className="dropdown">
                <li className={`${this.state.facilityDropdownFocused && !this.state.facilityDropdownActive ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon()}</li>
                <li ref={ elem => { this.facilities[0] = elem; }} aria-selected="false"  role="option" className={`${this.state.focusedFacilityIndex === 0 ? 'is-hovered' : ''}`} onClick={this.handleFacilityFilterSelect('health')}>{this.renderSelectOptionWithIcon('health')}</li>
                <li ref={ elem => { this.facilities[1] = elem; }} aria-selected="false"  role="option" className={`${this.state.focusedFacilityIndex === 1 ? 'is-hovered' : ''}`} onClick={this.handleFacilityFilterSelect('benefits')}>{this.renderSelectOptionWithIcon('benefits')}</li>
                <li ref={ elem => { this.facilities[2] = elem; }} aria-selected="false"  role="option" className={`${this.state.focusedFacilityIndex === 2 ? 'is-hovered' : ''}`} onClick={this.handleFacilityFilterSelect('cemetery')}>{this.renderSelectOptionWithIcon('cemetery')}</li>
                <li ref={ elem => { this.facilities[3] = elem; }} aria-selected="false"  role="option" className={`${this.state.focusedFacilityIndex === 3 ? 'is-hovered' : ''}`} onClick={this.handleFacilityFilterSelect('vet_center')}>{this.renderSelectOptionWithIcon('vet_center')}</li>
              </ul>
            </div>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="serviceType">Select Service Type</label>
            <div onKeyUp={this.handleKeyInput} className={serviceDropdownClasses} ref="serviceDropdown" tabIndex="0" role="combobox" aria-controls="expandable" aria-expanded="false" onClick={this.toggleServiceDropdown}>
              <div className="flex-center">
                {this.renderServiceSelectOption(currentQuery.serviceType)}
              </div>
              {this.renderServiceFilterOptions()}
            </div>
          </div>
          <div className="columns usa-width-one-sixth medium-2">
            <input type="submit" value="Search" onClick={this.handleSearch}/>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSearchQuery,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchControls);
