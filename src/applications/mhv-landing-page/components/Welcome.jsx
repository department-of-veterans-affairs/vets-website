import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Welcome = ({ loading, name }) => (
  <div
    className={classnames(
      'vads-u-display--flex',
      'vads-u-justify-content--flex-start',
      'vads-u-margin-bottom--1p5',
      { 'visibility:hidden': loading },
    )}
  >
    <h2
      className={classnames(
        'vads-u-font-size--h4',
        'medium-screen:vads-u-font-size--h3',
        'vads-u-margin-top--0',
        'vads-u-margin-bottom--0',
      )}
    >
      {!!name && (
        <>
          Welcome, <span data-dd-privacy="mask">{name}</span>
        </>
      )}
      {!name && <>Welcome</>}
    </h2>
    <div className="vads-u-font-size--md medium-screen:vads-u-font-size--lg vads-u-display--flex vads-u-align-items--center">
      <span
        className={classnames(
          'vads-u-color--primary-dark',
          'vads-u-padding-left--4',
          'vads-u-padding-right--0p5',
        )}
      >
        <va-icon icon="account_circle" size={3} />
      </span>
      <va-link
        href="/profile"
        text="Profile"
        className="vads-u-visibility--screen-reader"
      />
    </div>
  </div>
);

Welcome.defaultProps = {
  loading: true,
};

Welcome.propTypes = {
  loading: PropTypes.bool,
  name: PropTypes.string,
};

export default Welcome;
