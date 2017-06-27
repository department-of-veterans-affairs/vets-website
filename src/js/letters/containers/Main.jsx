import React from 'react';
import { connect } from 'react-redux';

import { getLetterList } from '../actions/letters';

class Main extends React.Component {
  componentDidMount() {
    this.props.getLetterList();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const letterState = state.letters;
  return {
    letters: letterState.letters,
    destination: letterState.destination,
    available: letterState.available
  };
}

const mapDispatchToProps = {
  getLetterList
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
