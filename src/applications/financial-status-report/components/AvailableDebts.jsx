import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDebts } from '../actions';
import DebtCard from './DebtCard';

class AvailableDebts extends Component {
  componentDidMount() {
    this.props.fetchDebts();
  }

  render() {
    return (
      <>
        <h2 className="vads-u-font-size--h4">Your available debts</h2>
        <p>
          Please select atleast one debt you want to request a waiver,
          compromise offer, or extended payment plan for.
        </p>
        <p>
          <strong>Note:</strong>
          If you have multiple debts and want different resolutions, you'll need
          to submit separate applications.
        </p>
        {this.props.debts.map((debt, index) => (
          <DebtCard debt={debt} key={`${index}-${debt.currentAr}`} />
        ))}
        <h3 className="vads-u-font-size--h4">
          What if I don't see the debt I'm looking for?
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
          architecto ducimus fuga laudantium perferendis quaerat sapiente. Aut
          blanditiis debitis, ea error fugit itaque mollitia, quidem repellat
          rerum suscipit veniam, voluptatibus.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
          architecto ducimus fuga laudantium perferendis quaerat sapiente. Aut
          blanditiis debitis.
        </p>
      </>
    );
  }
}

const mapStateToProps = state => ({
  debts: state.fsr.debts,
});

const mapDispatchToProps = {
  fetchDebts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AvailableDebts);
