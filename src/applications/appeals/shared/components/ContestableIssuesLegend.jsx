import React from 'react';
import PropTypes from 'prop-types';

// We shouldn't ever see the couldn't find contestable issues message since we
// prevent the user from navigating past the intro page; but it's here just in
// case we end up filtering out disqualifying and expired issues
export const ContestableIssuesLegend = ({ onReviewPage, inReviewMode }) => {
  let Wrap = 'h3';
  const wrapClassNames = ['vads-u-font-size--h3'];
  if (onReviewPage) {
    // Using a div in review mode, see
    // https://dsva.slack.com/archives/C8E985R32/p1672863010797129?thread_ts=1672860474.162309&cid=C8E985R32
    Wrap = inReviewMode ? 'div' : 'h4';
    wrapClassNames.push(
      'vads-u-font-family--serif',
      `vads-u-margin-top--${inReviewMode ? '2' : '0'}`,
    );
  } else {
    wrapClassNames.push('vads-u-margin-top--0');
  }
  return onReviewPage && inReviewMode ? null : (
    <>
      <legend className="vads-u-width--full vads-u-padding-top--0 vads-u-border-top--0">
        <Wrap className={wrapClassNames.join(' ')}>
          Select the issues you’d like us to review{' '}
          <span className="vads-u-color--secondary-dark vads-u-font-weight--normal vads-u-font-size--base">
            (*Required)
          </span>
        </Wrap>
      </legend>
      <div className="vads-u-margin-bottom--2">
        These are the issues we have on file for you. If an issue is missing
        from the list, you can add it here.
      </div>
    </>
  );
};

ContestableIssuesLegend.propTypes = {
  inReviewMode: PropTypes.bool,
  onReviewPage: PropTypes.bool,
};
