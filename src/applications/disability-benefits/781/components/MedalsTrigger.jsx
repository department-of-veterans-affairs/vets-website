import React from 'react';

// import PropTypes from 'prop-types';

export default class MedalTrigger extends React.Component {
  render() {
    //  console.log(this.props);

    return (
      <div>
        <button
          type="button"
          className="usa-button-secondary"
          onClick={this.props.onOpen}
        >
          {this.props.triggerText}
        </button>
      </div>
    );
  }
}
