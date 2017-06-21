import React from 'react';
import PropTypes from 'prop-types';

class LetterList extends React.Component {
  render() {
    // Replace this with collapsible panels
    const letterItems = (this.props.letters || []).map((letter) => {
      return (
        <li key={letter.letterType}>
          <a href="#">{letter.letterName}</a>
        </li>
      );
    });
    return (
      <div className="step-content">
        {letterItems}
      </div>
    );
  }
}

LetterList.PropTypes = {
  letters: PropTypes.array
};

export default LetterList;
