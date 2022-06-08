import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';

import MixedLanguageDisclaimer from '../MixedLanguageDisclaimer';
import LanguagePicker from '../LanguagePicker';

const Wrapper = props => {
  const {
    children,
    pageTitle,
    classNames = '',
    withBackButton = false,
    testID,
  } = props;

  useEffect(() => {
    focusElement('h1');
  }, []);

  const topPadding = withBackButton
    ? 'vads-u-padding-y--2'
    : ' vads-u-padding-y--3';

  return (
    <>
      <div
        className={`vads-l-grid-container ${classNames} ${topPadding}`}
        data-testid={testID}
      >
        <MixedLanguageDisclaimer />
        <LanguagePicker withTopMargin={!withBackButton} />
        <h1 tabIndex="-1" data-testid="header">
          {pageTitle}
        </h1>
        {children}
      </div>
    </>
  );
};

Wrapper.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
  classNames: PropTypes.string,
  testID: PropTypes.string,
  withBackButton: PropTypes.bool,
};

export default Wrapper;
