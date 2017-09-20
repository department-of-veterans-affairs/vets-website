import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../signin/containers/Main';
import Modal from '../Modal';
import { toggleLoginModal } from '../../../login/actions';

class LoginModal extends React.Component {
  render() {
    const { showModal } = this.props;

    return (
      <div>
        {this.props.children}
        <Modal cssClass="va-modal-large" visible={showModal} onClose={() => this.props.toggleLoginModal(false)}>
          <Main onLoggedIn={() => this.props.toggleLoginModal(false)}/>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    showModal: state.user.login.showModal
  };
}

const mapDispatchToProps = {
  toggleLoginModal
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
