import React from 'react';
import last from 'lodash/last';
import moment from 'moment';
import { Link } from 'react-router';
import { deductionCodes } from '../const';
import { bindActionCreators } from 'redux';
import { setActiveDebt } from '../actions';
import { connect } from 'react-redux';

class DebtLetterCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panelOpen: false,
    };
  }

  render() {
    const { debt } = this.props;
    const mostRecentHistory = last(debt.debtHistory);
    return (
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--1">
        <h4 className="vads-u-margin--0">
          {deductionCodes[debt.deductionCode]}
        </h4>
        <p>
          <strong>Status:</strong> {mostRecentHistory.status}
        </p>
        <p>
          <strong>Last updated:</strong>{' '}
          {moment(mostRecentHistory.date).format('MMMM D, YYYY')}
        </p>
        <Link
          className="usa-button"
          onClick={() => this.props.setActiveDebt(debt)}
          to="/view-details"
        >
          View debt details <i className="fa fa-chevron-right" />
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedDebt: state.debtLetters.selectedDebt,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ setActiveDebt }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLetterCard);
