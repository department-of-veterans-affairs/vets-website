import React from 'react';
import { connect } from 'react-redux';

const EmploymentHistory = () => {
  return (
    <>
      <h2 className="vads-u-font-size--h4">Your employment history</h2>
      <p>Please provide your employment history for the past two years.</p>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
          architecto ducimus fuga laudantium perferendis quaerat sapiente. Aut
          blanditiis debitis.
        </p>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  debts: state.fsr.debts,
});

export default connect(
  mapStateToProps,
  null,
)(EmploymentHistory);
