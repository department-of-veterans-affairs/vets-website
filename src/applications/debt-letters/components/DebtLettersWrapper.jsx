import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { bindActionCreators } from 'redux';
import { fetchDebtLetters } from '../actions';

class DebtLettersWrapper extends Component {
  componentDidMount() {
    this.props.fetchDebtLetters();
  }
  render() {
    const { user, isPending } = this.props;
    return (
      <RequiredLoginView verify user={user}>
        {isPending && <LoadingIndicator />}
        {!isPending && (
          <div className="usa-grid usa-grid-full">
            <h2>Debt Letters</h2>
          </div>
        )}
      </RequiredLoginView>
    );
  }
}

const mapStateToProps = state => ({
  isFetching: state.debts.isFetching,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchDebtLetters }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLettersWrapper);
