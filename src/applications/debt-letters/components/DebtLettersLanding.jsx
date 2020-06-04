import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import DebtLettersList from './DebtLettersList';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import { bindActionCreators } from 'redux';
import { fetchDebtLetters } from '../actions';

class DebtLettersLanding extends Component {
  componentDidMount() {
    this.props.fetchDebtLetters();
  }
  render() {
    const { isPending, debts } = this.props;
    return (
      <>
        <div className="usa-grid usa-grid-full vads-u-margin-bottom--4">
          <div className="usa-content usa-width-three-fourths">
            <CallToActionWidget appId="debt-letters">
              {isPending && <LoadingIndicator />}
              {!isPending && <DebtLettersList debts={debts} />}
            </CallToActionWidget>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  isFetching: state.debtLetters.isFetching,
  debts: state.debtLetters.debts,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchDebtLetters }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLettersLanding);
