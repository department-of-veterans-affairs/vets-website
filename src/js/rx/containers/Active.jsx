import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { loadPrescriptions } from '../actions/prescriptions';
import PrescriptionList from '../components/PrescriptionList';
import SortMenu from '../components/SortMenu';
import { sortOptions } from '../config.js';

class Active extends React.Component {
  componentWillMount() {
    this.props.dispatch(loadPrescriptions({ active: true }));
    this.handleSortOnChange = this.handleSortOnChange.bind(this);
    this.handleSortOnClick = this.handleSortOnClick.bind(this);
    this.dispatchSortAction = this.dispatchSortAction.bind(this);
  }

  dispatchSortAction(action) {
    this.props.dispatch({ type: action });
  }

  handleSortOnChange(domEvent) {
    if (domEvent.type === 'change') {
      browserHistory.push({
        pathname: '/rx',
        query: {
          sort: domEvent.target.value
        }
      });
    }
    this.dispatchSortAction(domEvent.target.value);
  }

  handleSortOnClick(domEvent) {
    const fullURL = domEvent.target.href;

    // Find the sort parameter, split the query string on the = and retrieve value
    const sortParam = fullURL.match(/sort=[-a-z]{1,}/i)[0].split('=')[1];
    this.dispatchSortAction(sortParam);
  }

  render() {
    const items = this.props.prescriptions.items;
    let content;

    if (items) {
      const sortValue = this.props.location.query.sort;

      content = (
        <div>
          <SortMenu
              changeHandler={this.handleSortOnChange}
              clickHandler={this.handleSortOnClick}
              options={sortOptions}
              selected={sortValue}/>
          <PrescriptionList
              items={this.props.prescriptions.items}
              // If we're sorting by facility, tell PrescriptionList to group 'em.
              grouped={sortValue === 'facilityName'}/>
        </div>
      );
    }

    return (
      <div className="va-tab-content">
        {content}
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Active);
