import React from 'react';
import { connect } from 'react-redux';

import Breadcrumbs from '../components/Breadcrumbs';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import GlossaryModal from '../components/GlossaryModal';
import { closeModal } from '../actions/modal';

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

  return <div className="bb-app">{view}</div>;
}

class BlueButtonApp extends React.Component {
  render() {
    return (
      <RequiredLoginView authRequired={3} serviceRequired={"bluebutton"}>
        <AppContent>
          <div>
            <div className="row">
              <div className="columns small-12">
                <Breadcrumbs location={this.props.location}/>
                {this.props.children}
              </div>
            </div>
            <GlossaryModal
                title={this.props.modal.title}
                content={this.props.modal.content}
                isVisible={this.props.modal.visible}
                onCloseModal={this.props.closeModal}/>
          </div>
        </AppContent>
      </RequiredLoginView>
    );
  }
}

BlueButtonApp.propTypes = {
  children: React.PropTypes.element
};

const mapStateToProps = (state) => {
  const bbState = state.health.bb;

  return {
    modal: bbState.modal,
  };
};
const mapDispatchToProps = {
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(BlueButtonApp);
