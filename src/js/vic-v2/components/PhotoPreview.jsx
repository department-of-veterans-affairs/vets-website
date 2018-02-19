import React from 'react';
import environment from '../../common/helpers/environment';
import LoadingIndicator from '../../common/components/LoadingIndicator';

export default class PhotoPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      loading: false,
      src: null,
      error: null
    };

    if (props.isLoggedIn && props.id) {
      const userToken = window.sessionStorage.userToken;
      const headers = {
        'X-Key-Inflection': 'camel',
        Authorization: `Token token=${userToken}`
      };

      this.state.loading = true;
      fetch(`${environment.API_URL}/v0/vic/profile_photo_attachments/${props.id}`, {
        headers
      }).then(resp => {
        if (resp.ok) {
          return resp.blob();
        }

        return new Error(resp.responseText);
      }).then(image => {
        const blob = new Blob([image]);
        this.setState({ src: window.URL.createObjectURL(blob), error: null, loading: false });
      }).catch(resp => {
        this.setState({ loading: false, error: resp.responseText || resp.message });
      });
    }
  }

  componentWillUnmount() {
    if (this.state.src) {
      window.URL.revokeObjectURL(this.state.src);
    }
  }

  onError = () => {
    this.setState({ processing: true });
  }

  render() {
    const { src, id, className } = this.props;

    if (this.state.loading) {
      return <LoadingIndicator message="Loading your profile photo..."/>;
    }

    if (this.state.processing) {
      return <em>Your photo is saved, but we're still processing it.</em>;
    }

    if (this.state.error) {
      return <em>Sorry, something went wrong when loading your profile photo.</em>;
    }

    if (this.state.src) {
      return (
        <img
          className={className}
          onError={this.onError}
          src={this.state.src}
          alt="Photograph of you that will be displayed on the ID card"/>
      );
    }

    if (!src && !id) {
      return <span>No photo chosen</span>;
    }

    return (
      <img
        className={className}
        src={src}
        alt="Photograph of you that will be displayed on the ID card"/>
    );
  }
}
