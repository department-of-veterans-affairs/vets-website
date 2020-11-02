import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDebts } from '../actions';

class AvailableDebts extends Component {
  componentDidMount() {
    this.props.fetchDebts();
  }

  render() {
    return (
      <>
        <h2>Available debt resolution options</h2>
        <ul>
          <li>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
            architecto aut eos fuga harum id magni? Commodi eius minima sint. Ad
            aliquam, aspernatur earum eum ex minima quisquam sunt voluptatum.
          </li>
          <li>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
            architecto aut eos fuga harum id magni? Commodi eius minima sint. Ad
            aliquam, aspernatur earum eum ex minima quisquam sunt voluptatum.
          </li>
          <li>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
            architecto aut eos fuga harum id magni? Commodi eius minima sint. Ad
            aliquam, aspernatur earum eum ex minima quisquam sunt voluptatum.
          </li>
        </ul>
        <h3>What if I want to dispute a debt?</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor dolore
          possimus provident qui, quia sunt vel vitae! Ad, corporis dolore enim
          expedita harum minima natus nulla sed similique totam ut? Lorem ipsum
          dolor sit amet, consectetur adipisicing elit. Ab dignissimos eligendi
          et in laboriosam molestiae neque nihil non officia placeat porro
          possimus quod reiciendis repellendus repudiandae velit, voluptates.
          Dolores, mollitia!
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
