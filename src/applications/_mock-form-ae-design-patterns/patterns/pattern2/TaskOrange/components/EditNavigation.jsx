import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

export const EditNavigation = ({ options, router }) => {
  return (
    <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-flex-direction--column vads-u-margin-top--3">
      <div className="vads-u-display--block mobile-lg:vads-u-display--flex">
        <button
          type="button"
          className="vads-u-margin-top--0 mobile-lg:vads-u-width--auto vads-u-width--full"
          data-action="save-edit"
          data-testid="save-edit-button"
          aria-live="polite"
          onClick={() =>
            router.push({
              pathname: '/2/task-orange/review-then-submit',
              state: {
                reviewId: options?.reviewId,
                success: true,
              },
            })
          }
        >
          Save to profile
        </button>
        <va-button
          data-testid="cancel-edit-button"
          secondary=""
          class="vads-u-margin--0 vads-u-margin-top--0 vads-u-width--full mobile-lg:vads-u-width--auto"
          text="Cancel"
        />
      </div>
    </div>
  );
};

export const EditNavigationWithRouter = withRouter(EditNavigation);

EditNavigation.propTypes = {
  options: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};
