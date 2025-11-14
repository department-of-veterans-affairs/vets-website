import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import NeedHelp from '../components/NeedHelp';

const Wrapper = props => {
  const { children, pageTitle, classNames = '', testID } = props;

  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <div
      className={`vads-l-grid-container vads-u-padding-x--2p5 desktop-lg:vads-u-padding-x--0 vads-u-padding-bottom--2 ${classNames}`}
      data-testid={testID}
    >
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          {pageTitle && (
            <h1 tabIndex="-1" data-testid="header">
              {pageTitle}
            </h1>
          )}
          {children}
          <NeedHelp />
        </div>
      </div>
    </div>
  );
};

export default Wrapper;

Wrapper.propTypes = {
  children: PropTypes.node,
  classNames: PropTypes.string,
  pageTitle: PropTypes.string,
  testID: PropTypes.string,
};
