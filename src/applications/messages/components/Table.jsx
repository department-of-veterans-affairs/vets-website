import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchInquiries } from '../actions';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';

export class MessageTable extends React.Component {
  componentDidMount() {
    this.props.dispatchFetchInquiries();
  }

  render() {
    return (
      <SortableTable
        className="va-table"
        currentSort={{
          value: 'String',
          order: 'ASC',
        }}
        fields={[
          {
            label: 'Subject',
            value: 'subject',
          },
          {
            label: 'Date last updated',
            value: 'lastActiveTimestamp',
          },
          {
            label: 'Reference',
            value: 'confirmationNumber',
          },
          {
            label: 'Status',
            value: 'status',
          },
        ]}
        data={this.props.data ? this.props.data : []}
      />
    );
  }
}

MessageTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      subject: PropTypes.string,
      lastActiveTimestamp: PropTypes.string,
      confirmationNumber: PropTypes.string,
      status: PropTypes.string,
    }),
  ),
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchFetchInquiries: () => {
      dispatch(fetchInquiries());
    },
  };
};

function mapStateToProps(state) {
  return {
    data: state.data,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageTable);
