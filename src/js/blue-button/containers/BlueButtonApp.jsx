import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <div className="row">
        <div className="columns">
          <h4>
            Placeholder message when data is not available
          </h4>
        </div>
      </div>
    );
  } else {
    view = children;
  }

  return <div className="blue-button-app">{view}</div>;
}

class BlueButtonApp extends React.Component {
  render() {
    return (
      <RequiredLoginView authRequired={3} serviceRequired={"bluebutton"}>
        <AppContent>
          <h1>Blue Button App</h1>
        </AppContent>
      </RequiredLoginView>
    );
  }
}

BlueButtonApp.propTypes = {
  children: React.PropTypes.element
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BlueButtonApp);
