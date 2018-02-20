import React from 'react';
import PropTypes from 'prop-types';
import environment from '../../common/helpers/environment';
import LoadingIndicator from '../../common/components/LoadingIndicator';

export default class PhotoPreview extends React.Component {
  constructor(props) {
    super(props);

    if (props.isLoggedIn && props.id && !props.src) {
      const userToken = window.sessionStorage.userToken;
      const headers = {
        'X-Key-Inflection': 'camel',
        Authorization: `Token token=${userToken}`
      };

      fetch(`${environment.API_URL}/v0/vic/profile_photo_attachments/${props.id}`, {
        headers
      }).then(resp => {
        if (resp.ok) {
          return resp.blob();
        }

        return new Error(resp.responseText);
      }).then(blob => {
        this.props.onUpdatePreview(window.URL.createObjectURL(blob));
      }).catch(err => {
        this.props.onError(err);
      });
    }
  }

  render() {
    const { src, id, className, isLoggedIn, processing } = this.props;

    if (processing) {
      return (
        <div className="usa-alert usa-alert-warning vic-processing-warning">
          <div className="usa-alert-body">
            <h4 className="usa-alert-title">We're still processing your preview photo</h4>
            This does not affect your application. You can continue down the form while we process your photo in the meantime.
          </div>
        </div>
      );
    }

    if (!src && id && isLoggedIn) {
      return <LoadingIndicator message="Loading your profile photo..."/>;
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

PhotoPreview.propTypes = {
  id: PropTypes.string,
  src: PropTypes.string,
  className: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  processing: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onUpdatePreview: PropTypes.func.isRequired
};
