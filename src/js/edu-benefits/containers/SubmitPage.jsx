import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '../../common/components/AlertBox.jsx';

class SubmitPage extends React.Component {
  render() {
    const content = (
      <span>Claim Received!</span>
    );

    return (
      <div className="form-panel">
        <AlertBox
            content={content}
            isVisible
            status="success"/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    currentLocation: ownProps.location.pathname
  };
}

// Fill this in when we start using actions
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitPage);
export { SubmitPage };
