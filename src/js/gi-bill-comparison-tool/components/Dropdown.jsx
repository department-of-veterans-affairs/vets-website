import React from 'react';

class Dropdown extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultOption
    };
  }

  render() {
    if (!this.props.visible) {
      return null;
    }
    return (
      <div id={this.props.identifier+'-form'} className={this.props.className}>
        { this.renderLabel() }
        <select id={this.props.identifier}
                name={this.props.identifier.replace(/\-/g, '_')}
                alt={this.props.alt}
                onChange={(e) => { this.props.onChange(e) && this.setState({value: event.target.value}) }}
                defaultValue={this.props.defaultOption}>
          { this.renderDropdownOptions(this.props.options) }
        </select>
      </div>
    );
  }

  renderLabel() {
    if (!this.props.showLabel) {
      return null;
    }
    return this.props.children;
  }

  renderDropdownOptions(optionsArray) {
    optionsArray = Object.assign([], optionsArray);
    if (optionsArray.length % 2 !== 0) {
      console.warn(optionsArray, 'contains odd number of elements');
    }
    let results = [];
    while (optionsArray.length > 1) {
      let key = optionsArray.shift();
      let label = optionsArray.shift();
      results.push(
        <option key={key} value={key}>{label}</option>
      );
    }
    return results;
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
}

export default Dropdown;
