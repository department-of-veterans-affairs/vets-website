/* Component that lets a veteran sort by prescription name,
 * facility, or last submit date.
*/

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

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
    this.props.onChange(event.target.value);
  }

  handleClick(sortValue, sortOrder) {
    return (event) => {
      event.preventDefault();
      this.props.onClick(sortValue, sortOrder);
    };
  }

  renderSortLinks() {
    const { selected: { value, order } } = this.props;

    const options = ['refillSubmitDate',
      'lastSubmitDate',
      'refillDate',
    ].includes(value) ? {
      'Newest to Oldest': 'ASC', 'Oldest to Newest': 'DESC'
    } : { 'A-Z': 'ASC', 'Z-A': 'DESC' };

    const sortLinks = Object.keys(options).map((e, i) => {
      const selectedClass = classNames({
        'rx-sort-active': options[e] === order,
      });

      return (
        <li key={i}>
          <a
              className={selectedClass}
              onClick={this.handleClick(value, options[e])}>
            {e}
          </a>
        </li>
      );
    });

    return <ul>{sortLinks}</ul>;
  }

  render() {
    const sortBys = this.props.options;
    const sortOptionElements = (options) => {
      return options.map((o, ind) => {
        return (
          <option
              key={ind}
              value={o.value}>{o.label}</option>
        );
      });
    };

    return (
      <form className="rx-sort va-dnp">
        <label htmlFor={this.selectId}>Sort by </label>
        <select
            id={this.selectId}
            value={this.props.selected.value}
            onChange={this.handleChange}>
          {sortOptionElements(sortBys)}
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
    value: React.PropTypes.string,
    label: React.PropTypes.string,
  })),
  selected: React.PropTypes.object
};

export default SortMenu;
