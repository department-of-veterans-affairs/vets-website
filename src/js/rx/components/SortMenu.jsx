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

  handleClick(sortValue) {
    return (event) => {
      event.preventDefault();
      this.props.onClick(sortValue);
    };
  }

  render() {
    const sortBys = this.props.options;
    const sortLinks = (options) => {
      return options.map((o, ind) => {
        // Sets an rx-sort-active class when the option value
        // matches the selected / default value
        const selectedClass = classNames({
          'rx-sort-active': o.value === this.props.selected
        });

        return (
          <li key={ind}>
            <a
                className={selectedClass}
                onClick={this.handleClick(o.value)}>
              {o.label}
            </a>
          </li>
        );
      });
    };

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
        <div className="rx-sort-wide">
          <span>Sort by</span>
          <ul className="va-list-ib">
            {sortLinks(sortBys)}
          </ul>
        </div>
        <div className="rx-sort-narrow">
          <label htmlFor={this.selectId}>Sort by</label>
          <select
              id={this.selectId}
              value={this.props.selected}
              onChange={this.handleChange}>
            {sortOptionElements(this.props.options)}
          </select>
        </div>
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
  selected: React.PropTypes.string
};

export default SortMenu;
