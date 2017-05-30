import React from 'react';
import PropTypes from 'prop-types';

// TODO: Come up with a better name than SaveFormLink
export default class SaveFormLink extends React.Component {
  render() {
    const {
      saveForm,
      savedStatus
    } = this.props;
    // TODO: Implement a sign in modal if !sessionStorage.userToken
    let content = <a onClick={saveForm}>Save and come back later</a>;
    if (savedStatus === 'no-auth') {
      content = <p>no-auth message</p>;
    } else if (savedStatus === 'failure') {
      content = <p>failure message</p>;
    } else if (savedStatus === 'pending') {
      content = <p>spinner or something</p>;
    } else if (savedStatus === 'success') {
      content = <p>success message</p>;
      // TODO: Redirect to a page like: https://marvelapp.com/2hj59b1/screen/28358414
    }

    // TODO: If we get a no-auth, we should reset the link after login
    //  Or, as a temporary solution, include the save link in the no-auth
    //  message..?
    return content;
  }
}

SaveFormLink.propTypes = {
  saveForm: PropTypes.func.isRequired,
  savedStatus: PropTypes.string.isRequired
};
