import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';

import { scrollTo } from 'platform/utilities/ui/scroll';
import {
  getChaptersLengthDisplay,
  createFormPageList,
  createPageList,
  getActiveExpandedPages,
  getCurrentChapterDisplay,
  handleFormNavFocus,
} from '../helpers';

import { REVIEW_APP_DEFAULT_MESSAGE } from '../constants';

export default function FormNav(props) {
  const {
    formConfig = {},
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

  const uniqueChapters = uniq(
    eligiblePageList.map(p => p.chapterKey).filter(key => !!key),
  );

  let page = eligiblePageList.filter(p => p.path === currentPath)[0];
  // If the page isn’t active, it won’t be in the eligiblePageList
  // This is a fallback to still find the chapter name if you open the page directly
  // (the chapter index will probably be wrong, but this isn’t a scenario that happens in normal use)
  if (!page) {
    page =
      formPages.find(p => `${formConfig.urlPrefix}${p.path}` === currentPath) ||
      {};
  }

  let current;
  let chapterName;
  let inProgressMessage = null;

  if (page.chapterKey) {
    const onReviewPage = page.chapterKey === 'review';
    current = uniqueChapters.indexOf(page.chapterKey) + 1;

    // The review page is always part of our forms, but isn’t listed in chapter list
    chapterName = onReviewPage
      ? formConfig?.customText?.reviewPageTitle || REVIEW_APP_DEFAULT_MESSAGE
      : formConfig.chapters[page.chapterKey].title;
    if (typeof chapterName === 'function' && !onReviewPage) {
      // for FormNav, we only call chapter-config title-function if
      // not on review-page.
      chapterName = chapterName({ formData, formConfig, onReviewPage });
    }
  }

  if (isLoggedIn) {
    inProgressMessage = (
      <span className="vads-u-display--block vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
        We&rsquo;ll save your application on every change.{' '}
        {inProgressFormId &&
          `Your application ID number is ${inProgressFormId}.`}
      </span>
    );
  }

  const showHeader = Math.abs(current - index) === 1;
  // Some chapters may have progress-bar & step-header hidden via hideFormNavProgress.
  const hideFormNavProgress =
    formConfig?.chapters[page.chapterKey]?.hideFormNavProgress;
  // Ensure other chapters [that do show progress-bar & step-header] have
  // the correct number & total [with progress-hidden chapters discounted].
  // formConfig, current, & chapters.length should NOT be manipulated,
  // as they are likely used elsewhere in functional logic.
  const chaptersLengthDisplay = getChaptersLengthDisplay({
    uniqueChapters,
    formConfig,
  });
  // Returns NaN if the current chapter isn't found
  const currentChapterDisplay = getCurrentChapterDisplay(formConfig, current);
  const stepText = Number.isNaN(currentChapterDisplay)
    ? ''
    : `Step ${currentChapterDisplay} of ${chaptersLengthDisplay}: ${chapterName ||
        ''}`;

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
      scrollTo('vaSegmentedProgressBar', { offset: -20 });
      handleFormNavFocus(page, formConfig, index).then(() => {
        // TODO: Remove console.log once expanded testing is complete
        // eslint-disable-next-line no-console
        console.log('[FormNav] handleFormNavFocus resolved.');
      });
    },
    [current, index, page, formConfig],
  );

  const v3SegmentedProgressBar = formConfig?.v3SegmentedProgressBar;
  // show progress-bar and stepText only if hideFormNavProgress is falsy.
  return (
    <div>
      {!hideFormNavProgress && (
        <va-segmented-progress-bar
          total={chaptersLengthDisplay}
          current={currentChapterDisplay}
          uswds={v3SegmentedProgressBar}
          heading-text={chapterName ?? ''} // functionality only available for v3
          name="vaSegmentedProgressBar"
          {...(v3SegmentedProgressBar ? { 'header-level': '2' } : {})}
        />
      )}
      {!v3SegmentedProgressBar &&
        !hideFormNavProgress && (
          <div className="schemaform-chapter-progress">
            <div className="nav-header nav-header-schemaform">
              {showHeader ? (
                <h2
                  id="nav-form-header"
                  data-testid="navFormHeader"
                  className="vads-u-font-size--h4"
                >
                  {stepText}
                  {inProgressMessage}
                </h2>
              ) : (
                <div data-testid="navFormDiv" className="vads-u-font-size--h4">
                  {stepText}
                  {inProgressMessage}
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

FormNav.defaultProps = {
  currentPath: '',
  formData: {},
  isLoggedIn: false,
  inProgressFormId: null,
};

FormNav.propTypes = {
  formConfig: PropTypes.shape({
    chapters: PropTypes.shape({}),
    customText: PropTypes.shape({
      reviewPageTitle: PropTypes.string,
    }),
    urlPrefix: PropTypes.string,
    useCustomScrollAndFocus: PropTypes.bool,
  }).isRequired,
  currentPath: PropTypes.string,
  formData: PropTypes.shape({}),
  inProgressFormId: PropTypes.number,
  isLoggedIn: PropTypes.bool,
};
