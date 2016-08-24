import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import PrescriptionList from '../components/PrescriptionList';
import PrintList from '../components/PrintList';
import SortMenu from '../components/SortMenu';

import { loadData } from '../actions/prescriptions.js';

class Active extends React.Component {
  componentWillMount() {
    this.props.dispatch(loadData());
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
    const sortParam = fullURL.match(/sort=[_A-Z]{1,}/)[0].split('=')[1];

    this.dispatchSortAction(sortParam);
  }

  render() {
    const sortValue = this.props.location.query.sort;
    const items = this.props.prescriptions.items;

    // TODO: Move to a config file?
    const sortOptions = [
      { value: 'SORT_PRESCRIPTION_NAME',
        label: 'Prescription name' },
      { value: 'SORT_FACILITY_NAME',
        label: 'Facility name' },
      { value: 'SORT_LAST_REQUESTED',
        label: 'Last requested' }];

    return (
      <div className="va-tab-content">
        <SortMenu
            options={sortOptions}
            selected={sortValue}
            changeHandler={this.handleSortOnChange}
            clickHandler={this.handleSortOnClick}/>
        <PrintList
            type="active"/>
        <PrescriptionList
            items={items}
            // If we're sorting by facility, tell PrescriptionList to group 'em.
            grouped={sortValue === 'SORT_FACILITY_NAME'}/>
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Active);

