import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

import { formatDate } from '../utils/helpers';
import Prescription from './Prescription';

class PrescriptionRow extends Prescription {
  render() {
    const { id, attributes } = this.props;

    return (
      <tr key={id}>
        <td>
          <Link to={`/${attributes.prescriptionId}`}>
            {attributes.prescriptionName}
          </Link><br/>
          <span>Prescription #: {id}</span>
        </td>
        <td>{formatDate(attributes.refillSubmitDate)}</td>
        <td>{attributes.facilityName}</td>
        <td>{attributes.refillRemaining}</td>
        <td>
          {this.showTracking()}
          {this.showRefillStatus()}
          {this.showMessageProvider()}
        </td>
      </tr>
    );
  }
}

class PrescriptionTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
  }
  handleSort(sortKey) {
    this.props.handleSort(sortKey);
  }

  renderTableRow(item) {
    const attrs = item.attributes;

    return (
      <tr key={item.id}>
        <td>
          <Link to={`/${attrs.prescriptionId}`}>
            {attrs.prescriptionName}
          </Link><br/>
          <span>Prescription #: {item.id}</span>
        </td>
        <td>{formatDate(attrs.refillSubmitDate)}</td>
        <td>{attrs.facilityName}</td>
        <td>{attrs.refillRemaining}</td>
        <td>links</td>
      </tr>
    );
  }

  renderSortableHeader(name, sortKey) {
    const classes = classnames({
      active: sortKey === this.props.sortValue,
      sortable: true,
    });

    return (
      <th className={classes} onClick={this.handleSort.bind(this, sortKey)}>
        {name}
        {sortKey === this.props.sortValue ? <span>&nbsp;<i className="fa fa-caret-down"></i></span> : null}
      </th>
    );
  }

  render() {
    const { items } = this.props;

    if (!items) {
      return null;
    }

    return (
      <div className="rx-prescription-table">
        <table className="usa-table-borderless va-table-list rx-table rx-table-list">
          <thead>
            <tr>
              {this.renderSortableHeader('Prescription Name', 'prescriptionName')}
              {this.renderSortableHeader('Last Requested Date', 'lastSubmitDate')}
              {this.renderSortableHeader('Facility Name', 'facilityName')}
              <th>Refills Left</th>
              <th>Refill Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => <PrescriptionRow key={i.id} {...i} glossaryModalHandler={this.props.glossaryModalHandler} refillModalHandler={this.props.refillModalHandler}/>)}
          </tbody>
        </table>
      </div>
    );
  }
}

PrescriptionTable.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  glossaryModalHandler: React.PropTypes.func.isRequired,
  refillModalHandler: React.PropTypes.func.isRequired,
  handleSort: React.PropTypes.func.isRequired,
  sortValue: React.PropTypes.string.isRequired,
};

export default PrescriptionTable;
