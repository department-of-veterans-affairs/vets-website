/* Component that lets a veteran sort by prescription name,
 * facility, or last requested date.
*/

import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class SortMenu extends React.Component {
  render() {
    const sortBys = this.props.options;
    const sortLinks = (options) => {
      return options.map((o, ind) => {
        // Sets an rx-sort-active class when the option value
        // matches the selected / default value
        const defaultCssClass = classNames({
          'rx-sort-active': o.value === this.props.selected
        });

        return (<li key={ind}><Link
            className={defaultCssClass}
            activeClassName="rx-sort-active"
            to={{
              pathname: '/',
              query: { sort: `${o.value}` }
            }}>{o.label}</Link></li>);
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
          <label htmlFor="sortby" className="va-disp-ib">Sort by </label>
          <ul className="va-list-ib" onClick={this.props.clickHandler}>
            {sortLinks(sortBys)}
          </ul>
        </div>
        <div className="rx-sort-narrow">
          <select
              value={this.props.selected}
              id="sortby"
              onChange={this.props.changeHandler}>
            {sortOptionElements(this.props.options)}
          </select>
        </div>
      </form>
    );
  }
}

SortMenu.propTypes = {
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string,
    label: React.PropTypes.string,
  })),
  changeHandler: React.PropTypes.func,
  clickHandler: React.PropTypes.func,
};

export default SortMenu;
