import React from 'react';
import { connect } from 'react-redux';

class Folder extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

Folder.propTypes = {
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Folder);
