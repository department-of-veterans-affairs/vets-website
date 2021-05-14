import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '../utils/helpers';

function PreviewBanner({ toolUrl = '/gids' }) {
  const history = useHistory();
  const queryParams = useQueryParams();

  const onViewLiveVersion = () => {
    queryParams.delete('version');
    history.push(queryParams.toString());
  };

  return (
    <div className="gi-preview-banner">
      <div className="outer small-12 medium-12 large-9">
        <div className="inner">
          <h5>Preview draft</h5>
          <p>
            <span className="actions">
              <button
                type="button"
                className="va-button-link learn-more-button"
                onClick={onViewLiveVersion}
              >
                View live version
              </button>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a href={toolUrl}>Go back to the data tool</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

PreviewBanner.propTypes = {
  toolUrl: PropTypes.string,
};

export default PreviewBanner;
