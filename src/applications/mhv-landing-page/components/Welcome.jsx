import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Welcome = ({ loading, name }) => (
  <div
    className={classnames(
      'vads-u-display--flex',
      'vads-u-justify-content--flex-start',
      'vads-u-border-color--gray-light',
      'vads-u-border-bottom--2px',
      'vads-u-margin-bottom--3',
      { 'visibility:hidden': loading },
    )}
  >
    <div>
      <h2 className="vads-u-font-size--h4 medium-screen:vads-u-font-size--h3 vads-u-margin-top--0">
        {!!name && (
          <>
            Welcome, <span data-dd-privacy="mask">{name}</span>
          </>
        )}
        {!name && <>Welcome</>}
      </h2>
    </div>
    <div className="vads-u-font-size--md medium-screen:vads-u-font-size--lg">
      <i
        aria-hidden="true"
        role="img"
        className="fas fa-user vads-u-color--primary-darker vads-u-padding-left--4 vads-u-padding-right--0p5"
      />
      <va-link href="/profile" text="Profile" uswds="false" />
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
