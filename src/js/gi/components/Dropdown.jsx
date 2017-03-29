import React from 'react';

class Dropdown extends React.Component {

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <div className={this.props.className}>
        <label htmlFor={this.props.name}>
          {this.props.label || this.props.children}
        </label>
        <select
            id={this.props.name}
            name={this.props.name}
            alt={this.props.alt}
            value={this.props.value}
            onChange={this.props.onChange}>
          {this.props.options.map(({ value, label }) =>
            <option key={value} value={value}>{label}</option>
          )}
        </select>
      </div>
    );
  }

}

Dropdown.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ]),
  options: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.string,
      value: React.PropTypes.string,
    })).isRequired,
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  alt: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
};

Dropdown.defaultProps = {
  className: 'form-group top-aligned',
  visible: false,
};

export default Dropdown;
