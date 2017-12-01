import React, { Component } from 'react';

class SelectComponent extends Component {

  render() {
    const { optionType } = this.props;
    const selectedType = this.props.selectedType || 'All';
    const titleType = optionType.charAt(0).toUpperCase() + optionType.slice(1);

    return (
      <div className="columns usa-width-one-fourth medium-3">
        <label htmlFor={`${optionType}Type`} id={`${optionType}-label`}>{`Select ${titleType} Type`}</label>
        <div
          onKeyDown={this.props.navigateDropdown}
          className={this.props.dropdownClasses}
          ref={this.props.setDropdown}
          tabIndex="0"
          role="combobox"
          aria-controls="expandable"
          aria-expanded="false"
          aria-labelledby={`${optionType}-label`}
          aria-required="false"
          aria-activedescendant={selectedType}
          onClick={this.props.toggleDropdown}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default SelectComponent;
