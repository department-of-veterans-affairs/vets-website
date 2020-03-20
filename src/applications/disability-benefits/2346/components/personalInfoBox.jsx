import moment from 'moment';
import { genderLabels } from 'platform/static-data/labels';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getVeteranInformationData } from '../actions';

class personalInfoBox extends React.Component {
  componentDidMount() {
    this.props.getVeteranInformationData();
  }
  render() {
    const { first, last, gender, dateOfBirth } = this.props;
    return (
      <div>
        <p>This is the personal information we have for you.</p>
        <div>
          <div className="usa-alert schemaform-sip-alert">
            <div className="usa-alert-body">
              <p className="vads-u-margin--1px">
                {first} {last}
              </p>
              <p className="vads-u-margin--1px">
                Date of Birth: {moment(dateOfBirth).format('MM/DD/YYYY')}
              </p>
              <p className="vads-u-margin--1px">
                Gender: {gender ? genderLabels[gender] : ''}
              </p>
            </div>
          </div>
          <br />
        </div>
      </div>
    );
  }
}

personalInfoBox.propTypes = {
  first: PropTypes.string.isRequired,
  last: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  dateOfBirth: PropTypes.string.isRequired,
  getVeteranInformationData: PropTypes.func.isRequired,
};

personalInfoBox.defaultProps = {
  first: '',
  last: '',
  gender: '',
  dateOfBirth: '',
};

const mapStateToProps = state => ({
  first: state.form?.data?.fullName?.first,
  last: state.form?.data?.fullName?.last,
  gender: state.form?.data?.gender,
  dateOfBirth: state.form?.data?.dateOfBirth,
});
const mapDispatchToProps = {
  getVeteranInformationData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(personalInfoBox);
