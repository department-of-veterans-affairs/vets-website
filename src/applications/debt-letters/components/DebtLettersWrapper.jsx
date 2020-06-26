import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import { bindActionCreators } from 'redux';
import { fetchDebtLetters } from '../actions';

class DebtLettersWrapper extends Component {
  componentDidMount() {
    this.props.fetchDebtLetters();
  }

  renderError = () => (
    <AlertBox headline="Error alert" content="Temp error text" status="error" />
  );

  render() {
    const { isPending, children, isError } = this.props;
    return (
      <>
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--4 vads-u-margin-top--2 vads-u-font-family--serif">
          <div>
            <CallToActionWidget appId="debt-letters">
              {isPending && <LoadingIndicator />}
              {isError && this.renderError()}
              {!isPending && !isError && children}
            </CallToActionWidget>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isFetching: state.debtLetters.isFetching,
  debts: state.debtLetters.debts,
  isError: state.debtLetters.isError,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchDebtLetters }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLettersWrapper);
