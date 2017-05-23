import PropTypes from 'prop-types';
import React from 'react';

export default class RadioButtonsSubSection extends React.Component {
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

RadioButtonsSubSection.propTypes = {
  showIfValueChosen: PropTypes.string.isRequired
};
