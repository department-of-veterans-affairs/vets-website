import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchInquiries } from '../actions';
import Table from '@department-of-veterans-affairs/component-library/Table';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';

export class MessageTable extends React.Component {
  componentDidMount() {
    this.props.fetchInquiries();
  }

  render() {
    return (
      <RequiredLoginView
        serviceRequired={[backendServices.USER_PROFILE]}
        user={this.props.user}
      >
        <h1 className={'vads-u-padding-x--2'}>My messages</h1>
        <div
          className={
            'vads-u-padding-x--2 medium-screen:vads-u-padding-x--0 vads-u-margin-bottom--6'
          }
        >
          <Table
            fields={[
              {
                label: 'Subject',
                value: 'subject',
              },
              {
                label: 'Date last updated',
                value: 'dateLastUpdated',
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
        </div>
      </RequiredLoginView>
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

const mapDispatchToProps = {
  fetchInquiries,
};

function mapStateToProps(state) {
  const userState = state.user;

  return {
    data: state.messages.data,
    user: userState,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageTable);
