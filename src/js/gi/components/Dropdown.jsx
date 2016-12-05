import React from 'react';

class Dropdown extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultOption
    };
  }

  // renders a list of options defined as an array
  // in the form of [value1, label1, value2, label2...]
  renderDropdownOptions(optionsArray) {
    const options = Object.assign([], optionsArray);
    const results = [];
    while (options.length > 1) {
      let key = options.shift();
      let label = options.shift();
      results.push(<option key={key} value={key}>{label}</option>);
    }
    return results;
  }

  renderLabel() {
    if (!this.props.showLabel) {
      return null;
    }
    return this.props.children;
  }

  render() {
    if (!this.props.visible) {
      return null;
    }
    return (
      <div id="{this.props.identifier}-form" className={this.props.className}>
        {this.renderLabel()}
        <select id={this.props.identifier}
            name={this.props.identifier.replace(/\-/g, '_')}
            alt={this.props.alt}
            onChange={(e) => { return this.props.onChange(e) && this.setState({ value: event.target.value }); }}
            defaultValue={this.props.defaultOption}>
          {this.renderDropdownOptions(this.props.options)}
        </select>
      </div>
    );
  }
}

Dropdown.propTypes = {
  showLabel: React.PropTypes.bool.isRequired,
  identifier: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  alt: React.PropTypes.string.isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  defaultOption: React.PropTypes.string,
  visible: React.PropTypes.bool.isRequired
};

Dropdown.defaultProps = {
  showLabel: true,
  className: 'form-group top-aligned',
  identifier: 'id-goes-here',
  alt: 'Alt Text',
  options: [
    'one', 'One',
    'two', 'Two'
  ],
  defaultOption: 'two',
  visible: false
};

export default Dropdown;
