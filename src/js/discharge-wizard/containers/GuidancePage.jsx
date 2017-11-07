import { connect } from 'react-redux';
import React from 'react';

class GuidancePage extends React.Component {
  render() {
    return (
      <div>
        <h1>Upgrading Your Discharge Status: What to know</h1>
        <div className="medium-8">
          Result
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formValues: state.dischargeWizard.form,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GuidancePage);
