import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import PrescriptionList from '../components/PrescriptionList';
import PrintList from '../components/PrintList';
import SortMenu from '../components/SortMenu';

class Active extends React.Component {
  componentWillMount() {
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
    const sortValue = this.props.location.query.sort;
    const items = this.props.prescriptions.items;

    // TODO: Move to a config file?
    const sortOptions = [
      { value: 'prescription-name',
        label: 'Prescription name' },
      { value: 'facility-name',
        label: 'Facility name' },
      { value: 'last-requested',
        label: 'Last requested' }];

    return (
      <div className="va-tab-content">
        <SortMenu
            changeHandler={this.handleSortOnChange}
            clickHandler={this.handleSortOnClick}
            options={sortOptions}
            selected={sortValue}/>
        <PrintList
            type="active"/>
        <PrescriptionList
            items={items}
            // If we're sorting by facility, tell PrescriptionList to group 'em.
            grouped={sortValue === 'facility-name'}/>
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Active);

