import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import classNames from 'classnames';

import { focusElement } from 'platform/utilities/ui';

import NeedHelp from '../components/NeedHelp';

const Wrapper = props => {
  const {
    children,
    pageTitle,
    className = '',
    testID,
    showBackLink = false,
  } = props;

  const navigate = useNavigate();

  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <div
      className={classNames(`vads-l-grid-container`, {
        'vads-u-padding-y--3': !showBackLink,
        'vads-u-padding-top--2 vads-u-padding-bottom--3': showBackLink, // Make the spacing consistent when showBackLink is true
        [className]: className,
      })}
      data-testid={testID}
    >
      {showBackLink && (
        <div className="vads-u-margin-bottom--2p5 vads-u-margin-top--0">
          <nav aria-label="backlink">
            <va-link
              back
              aria-label="Back link"
              data-testid="back-link"
              text="Back"
              href="#"
              onClick={e => {
                e.preventDefault();
                navigate(-1);
              }}
            />
          </nav>
        </div>
      )}
      {pageTitle && (
        <h1 tabIndex="-1" data-testid="header">
          {pageTitle}
        </h1>
      )}
      {children}
      <NeedHelp />
    </div>
  );
};

export default Wrapper;

Wrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  pageTitle: PropTypes.string,
  showBackLink: PropTypes.bool,
  testID: PropTypes.string,
};
