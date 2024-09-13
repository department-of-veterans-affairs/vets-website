import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useQueryParams } from '../utils/helpers';
import Button from './Button';

export default function PreviewBanner({ version, toolUrl = '/gids' }) {
  const when = moment(version.createdAt).format(
    'MMM D, YYYY [at] h:mm a [EST]',
  );

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
            This is what the version of this data from {when} will look
            like.&nbsp;
            <span className="actions">
              <Button
                type="button"
                className="va-button-link learn-more-button"
                onClick={onViewLiveVersion}
              >
                View live version
              </Button>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a href={toolUrl}>Go back to the data tool</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
