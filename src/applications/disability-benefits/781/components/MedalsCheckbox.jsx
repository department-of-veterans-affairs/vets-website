import React from 'react';
import MedalTrigger from './MedalsTrigger';
import MedalsContent from './MedalsContent';
// import PropTypes from 'prop-types';

export default class MedalsCheckbox extends React.Component {
  state = { isOpen: false };

  onOpen = () => {
    this.setState({ isOpen: true });
  };

  onClose = () => {
    this.setState({ isOpen: false });
  };
  render() {
    // console.log(this.props);
    // console.log(this.props.schema.properties);

    const { isOpen } = this.state;

    return (
      <div>
        <MedalTrigger onOpen={this.onOpen} triggerText={'Open Modal'} />
        {isOpen && (
          <MedalsContent
            onClose={this.onClose}
            items={this.props.schema.properties}
          />
        )}
      </div>
    );
  }
}
