import React from 'react';
import classNames from 'classnames';

class CharacterCount extends React.Component {
  render() {
    const charClass = classNames(
      this.props.cssClass,
      { isnegative: this.props.count < 0 });

    return (
      <div className={charClass}>
        Characters left: <span>{this.props.count}</span>
      </div>
    );
  }
}

CharacterCount.propTypes = {
  count: React.PropTypes.number,
  cssClass: React.PropTypes.string
};

export default CharacterCount;
