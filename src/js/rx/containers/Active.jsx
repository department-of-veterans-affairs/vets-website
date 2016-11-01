import React from 'react';
import { connect } from 'react-redux';

import { loadPrescriptions, sortPrescriptions } from '../actions/prescriptions';
import PrescriptionList from '../components/PrescriptionList';
import SortMenu from '../components/SortMenu';
import { sortOptions } from '../config.js';

class Active extends React.Component {
  constructor(props) {
    super(props);
    this.handleSortOnChange = this.handleSortOnChange.bind(this);
  }

  componentDidMount() {
    this.props.loadPrescriptions({ active: true });
  }

  componentDidUpdate() {
    const newSort = this.props.location.query.sort;
    const oldSort = this.props.prescriptions.active.sort;

    if (newSort !== oldSort) {
      this.props.sortPrescriptions(newSort);
    }
  }

  handleSortOnChange(domEvent) {
    if (domEvent.type === 'change') {
      this.context.router.push({
        pathname: '/',
        query: { sort: domEvent.target.value }
      });
    }
  }

  render() {
    const items = this.props.prescriptions.items;
    let content;

    const sortParam = this.props.location.query.sort;

    if (items) {
      const sortValue = sortParam || 'prescriptionName';

      content = (
        <div>
          <SortMenu
              changeHandler={this.handleSortOnChange}
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

Active.contextTypes = {
  router: React.PropTypes.object.isRequired
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = {
  loadPrescriptions,
  sortPrescriptions
};

export default connect(mapStateToProps, mapDispatchToProps)(Active);
