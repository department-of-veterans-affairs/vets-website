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
      className={`vads-l-grid-container vads-u-padding-y--3 ${classNames}`}
      data-testid={testID}
    >
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
  classNames: PropTypes.string,
  pageTitle: PropTypes.string,
  testID: PropTypes.string,
};
