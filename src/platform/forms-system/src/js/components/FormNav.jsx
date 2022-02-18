import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';

import {
  createFormPageList,
  createPageList,
  getActiveExpandedPages,
} from '../helpers';

import { focusElement } from '../utilities/ui';

import { REVIEW_APP_DEFAULT_MESSAGE } from '../constants';

export default function FormNav(props) {
  const {
    formConfig,
    currentPath,
    formData,
    isLoggedIn,
    inProgressFormId,
  } = props;

  const [index, setIndex] = useState(0);

  // This is converting the config into a list of pages with chapter keys,
  // finding the current page, then getting the chapter name using the key
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);

  const eligiblePageList = getActiveExpandedPages(pageList, formData);

  const chapters = uniq(
    eligiblePageList.map(p => p.chapterKey).filter(key => !!key),
  );

  let page = eligiblePageList.filter(p => p.path === currentPath)[0];
  // If the page isn’t active, it won’t be in the eligiblePageList
  // This is a fallback to still find the chapter name if you open the page directly
  // (the chapter index will probably be wrong, but this isn’t a scenario that happens in normal use)
  if (!page) {
    page = formPages.find(
      p => `${formConfig.urlPrefix}${p.path}` === currentPath,
    );
  }

  let current;
  let chapterName;
  let inProgressMessage = null;
  if (page) {
    current = chapters.indexOf(page.chapterKey) + 1;
    // The review page is always part of our forms, but isn’t listed in chapter list
    chapterName =
      page.chapterKey === 'review'
        ? formConfig?.customText?.reviewPageTitle || REVIEW_APP_DEFAULT_MESSAGE
        : formConfig.chapters[page.chapterKey].title;
    if (typeof chapterName === 'function') {
      chapterName = chapterName();
    }
  }

  if (isLoggedIn) {
    inProgressMessage = (
      <span className="vads-u-display--block vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
        Your application will be saved on every change.{' '}
        {inProgressFormId &&
          `Your application ID number is ${inProgressFormId}.`}
      </span>
    );
  }

  const stepText = `Step ${current} of ${chapters.length}: ${chapterName}`;
  const showHeader = Math.abs(current - index) === 1;

  // The goal with this is to quickly "remove" the header from the DOM, and
  // immediately re-render the component with the header included.
  // `current` changes when the form chapter changes, and when this happens
  // we want to force react to remove the <h2> and re-render it. This should
  // ensure that VoiceOver on iOS will pick up on the new <h2>
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/12323
  useEffect(
    () => {
      if (current > index + 1) {
        setIndex(index + 1);
      } else if (current === index) {
        setIndex(index - 1);
      }

      return () => {
        focusElement('.nav-header > h2');
      };
    },
    [current, index],
  );

  return (
    <div>
      <va-segmented-progress-bar total={chapters.length} current={current} />
      <div className="schemaform-chapter-progress">
        <div className="nav-header nav-header-schemaform">
          {showHeader && (
            <h2 id="nav-form-header" className="vads-u-font-size--h4">
              {stepText}
              {inProgressMessage}
            </h2>
          )}
          {!showHeader && (
            <div className="vads-u-font-size--h4">
              {stepText}
              {inProgressMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

FormNav.defaultProps = {
  formConfig: {
    customText: {
      reviewPageTitle: '',
    },
  },
  currentPath: '',
  formData: {},
  isLoggedIn: false,
  inProgressFormId: null,
};

FormNav.propTypes = {
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      reviewPageTitle: PropTypes.string,
    }),
  }).isRequired,
  inProgressFormId: PropTypes.number,
  isLoggedIn: PropTypes.bool,
};
