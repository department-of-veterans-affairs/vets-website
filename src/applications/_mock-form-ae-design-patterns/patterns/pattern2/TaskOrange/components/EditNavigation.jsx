import React from 'react';
import { withRouter } from 'react-router';

export const EditNavigation = props => {
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
            props.router.push({
              pathname: '/2/task-orange/review-then-submit',
              hash: `#${props?.options?.reviewId}`,
              state: {
                reviewId: props.options.reviewId,
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
