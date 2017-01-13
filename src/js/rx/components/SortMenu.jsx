/* Component that lets a veteran sort by prescription name,
 * facility, or last submit date.
*/

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

const isDateAttribute = (option) => {
  return _.includes([
    'refillSubmitDate',
    'lastSubmitDate',
    'refillDate'
  ], option);
};

class SortMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.selectId = _.uniqueId('sort-menu-');
  }

  handleChange(event) {
    const { value } = event.target;
    // By default, sort dates by most recent.
    const order = isDateAttribute(value) ? 'DESC' : 'ASC';
    this.props.onChange(value, order);
  }

  handleClick(sortValue, sortOrder) {
    return (event) => {
      event.preventDefault();
      this.props.onClick(sortValue, sortOrder);
    };
  }

  renderSortLinks() {
    const { selected: { value, order } } = this.props;

    const options = isDateAttribute(value) ? {
      'Newest to Oldest': 'DESC',
      'Oldest to Newest': 'ASC'
    } : {
      'A-Z': 'ASC',
      'Z-A': 'DESC'
    };

    const sortLinks = Object.keys(options).map((label) => {
      const selectedClass = classNames({
        'rx-sort-active': options[label] === order,
      });

      return (
        <li key={label}>
          <a
              className={selectedClass}
              onClick={this.handleClick(value, options[label])}>
            {label}
          </a>
        </li>
      );
    });

    return <ul>{sortLinks}</ul>;
  }

  render() {
    const sortOptions = this.props.options.map((option) => {
      return (
        <option
            key={option.value}
            value={option.value}>
          {option.label}
        </option>
      );
    });

    return (
      <form className="rx-sort va-dnp">
        <label htmlFor={this.selectId}>Sort by</label>
        <select
            id={this.selectId}
            value={this.props.selected.value}
            onChange={this.handleChange}>
          {sortOptions}
        </select>
        {this.renderSortLinks()}
      </form>
    );
  }
}

SortMenu.propTypes = {
  onChange: React.PropTypes.func,
  onClick: React.PropTypes.func,
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string,
    value: React.PropTypes.string
  })),
  selected: React.PropTypes.shape({
    order: React.PropTypes.string,
    value: React.PropTypes.string
  })
};

export default SortMenu;
