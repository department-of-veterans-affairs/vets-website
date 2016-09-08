import React from 'react';
import { connect } from 'react-redux';

class Main extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

Main.propTypes = {
  children: React.PropTypes.node
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Main);
