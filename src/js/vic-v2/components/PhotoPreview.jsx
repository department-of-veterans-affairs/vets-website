import React from 'react';

export default class PhotoPreview extends React.Component {
  constructor() {
    super();
    this.state = {
      processing: false
    };
  }

  onError = () => {
    this.setState({ processing: true });
  }

  render() {
    const { src, className } = this.props;

    if (this.state.processing) {
      return <em>Your photo is saved, but we're still processing it.</em>;
    }

    if (!src) {
      return <span>No photo chosen</span>;
    }

    return (
      <img
        className={className}
        onError={this.onError}
        src={src}
        alt="Photograph of you that will be displayed on the ID card"/>
    );
  }
}
