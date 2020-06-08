import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import { bindActionCreators } from 'redux';
import { fetchDebtLetters } from '../actions';

class DebtLettersWrapper extends Component {
  componentDidMount() {
    this.props.fetchDebtLetters();
  }
  render() {
    const { isPending, children, isLoggedIn } = this.props;
    return (
      <>
        {!isLoggedIn && (
          <Breadcrumbs>
            <a href="/">Home</a>
            <a href="/debt-letters">Debt Letters</a>
          </Breadcrumbs>
        )}
        <div className="usa-grid usa-grid-full vads-u-margin-bottom--4">
          <div className="usa-content usa-width-three-fourths">
            <CallToActionWidget appId="debt-letters">
              {isPending && <LoadingIndicator />}
              {!isPending && children}
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
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchDebtLetters }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLettersWrapper);
