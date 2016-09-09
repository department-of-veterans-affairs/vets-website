import React from 'react';
import { connect } from 'react-redux';

class Inbox extends React.Component {
  componentWillMount() {
    // Fetch inbox...
  }

  render() {
    return (
      <div>
        <h2>Inbox</h2>
      </div>
    );
  }
}

Inbox.propTypes = {
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Inbox);
