import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { setData } from 'platform/forms-system/src/js/actions';
import { scrollTo, scrollToFirstError } from 'platform/utilities/scroll';
import { focusElement } from '../../utilities/ui/focus';

/**
 * Problems to address:
 * - Veteran fills out sub-task while not logged in, then logs in. All saved
 *   form data is lost. Solution is to save form data to session storage
 * - If there is a save-in-progress, this will over-write the sub-task changes
 *   made to the `form.data`. Thia may not be an issue since that means the
 *   Veteran has already completed the sub-task previously. Either way, the
 *   sub-task data is also saved to the `form.data`
 */
export const SUBTASK_SESSION_STORAGE = 'subTaskData';

export const getStoredSubTask = () =>
  JSON.parse(window.sessionStorage.getItem(SUBTASK_SESSION_STORAGE) || '{}');

export const setStoredSubTask = data =>
  window.sessionStorage.setItem(
    SUBTASK_SESSION_STORAGE,
    JSON.stringify(data || {}),
  );

export const resetStoredSubTask = () =>
  window.sessionStorage.removeItem(SUBTASK_SESSION_STORAGE);

/**
 * SubTask~destinationCallback
 * @type {Function}
 * @param {Object} data - form.data object
 * @return {String} - string of page name, return falsy value to render the
 *  button with no set destination. Return null if you don't what to render the
 *  button
 */
/**
 * SubTask~pageObject
 * @type {Object}
 * @property {JSX} component - SubTask page component
 * @property {String} name - SubTask page name
 * @property {Function} validate - validate check to allow changing pages
 * @property {String|null|SubTask~destinationCallback} back - back button
 *  destination. Set string to page name to return to when the back button is
 *  used. Using null will indicate that the button should not be rendered
 * @property {String|null|SubTask~destinationCallback} next - next button
 *  destination. Set string to page name to go to next when the continue button
 *  is used. Using null will indicate that the button should not be rendered
 */
/**
 * SubTask (one question per page wizard replacement)
 * @param {Object} data - complete form data
 * @param {Array.<SubTask~pageObject>} pages - array of page objects
 * @param {Object} router - React router
 * @returns
 */
export const SubTask = props => {
  const { pages = [], formData, setFormData, router, focusOnAlertRole } = props;
  const [currentPage, setCurrentPage] = useState(pages[0] || {});
  const [subTaskData, setSubTaskData] = useState(getStoredSubTask());
  const [hasError, setHasError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const checkValid = useCallback(
    (data = subTaskData) => {
      const isValid =
        typeof currentPage.validate === 'function'
          ? currentPage.validate(data)
          : true; // No validate function, return true (e.g. back button)

      setHasError(!isValid);
      return isValid;
    },
    [currentPage, subTaskData],
  );

  useEffect(() => checkValid(subTaskData), [subTaskData, checkValid]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    () => {
      // Clear page submitted flag
      setSubmitted(false);
      // H1 must be unique on each sub-task page
      focusElement('h1');
      // Scroll new page to top
      scrollTo('topContentElement');
    },
    // We only want to call this useEffect when the page changes
    [currentPage.name],
  );

  // Get page name or url of destination page
  const getDestinationPage = destination =>
    typeof destination === 'function' ? destination(subTaskData) : destination;
  const isPageUrl = pageOrUrl => (pageOrUrl || '').startsWith('/');

  /**
   * SubTask form state
   * @param {Object} newState - pageHistory state from SubTask page
   */
  const setPageData = newState => {
    // Set both form.data and form.subTaskData; both will be cleared if the user
    // logs in on the introduction page. If already logged in, form data is
    // cleared if the user has a form in-progress
    setFormData({ ...formData, ...newState });

    const newSubTaskData = { ...subTaskData, ...newState };
    setSubTaskData(newSubTaskData);
    // saving to session storage so the introduction page can pull this after
    // the Veteran has logged in
    setStoredSubTask(newSubTaskData);
    checkValid(newSubTaskData);
  };

  const pageCheck = async direction => {
    // Don't check validation when going back
    if (direction === 'back') {
      setHasError(false);
    } else {
      setSubmitted(true);
      if (!checkValid()) {
        await scrollToFirstError({ focusOnAlertRole });
        return false;
      }
    }

    const nameOrUrl = getDestinationPage(currentPage[direction]);
    // nameOrUrl should be a string: name or url path
    if (isPageUrl(nameOrUrl)) {
      router.push(nameOrUrl);
      return false;
    }
    const nextPage = pages.find(page => page.name === nameOrUrl);
    return nameOrUrl && nextPage ? setCurrentPage(nextPage) : false;
  };

  const backButton =
    getDestinationPage(currentPage.back) !== null ? (
      <va-button back onClick={() => pageCheck('back')}>
        Back
      </va-button>
    ) : null;

  const continueButton =
    getDestinationPage(currentPage.next) !== null ? (
      <va-button
        continue
        onClick={() => {
          pageCheck('next');

          if (currentPage.onContinue) {
            currentPage.onContinue(formData);
          }
        }}
      >
        Continue
      </va-button>
    ) : null;

  const Page = currentPage.component;

  return (
    <div className="subtask-container">
      <form
        ref={formRef}
        onSubmit={e => e.preventDefault()}
        data-page={currentPage.name}
        className="vads-u-margin-bottom--2"
      >
        <div className="subtask-content">
          <Page
            key={currentPage.name}
            data={subTaskData}
            error={submitted && hasError}
            setPageData={setPageData}
          />
        </div>
      </form>
      <div className="subtask-navigation">
        {backButton}
        {continueButton}
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setFormData: setData,
};

const mapStateToProps = state => ({
  formData: state.form.data || {},
});

SubTask.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.func,
        PropTypes.node,
      ]).isRequired,
      validate: PropTypes.func,
      back: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      next: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    }),
  ).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  focusOnAlertRole: PropTypes.bool,
  formData: PropTypes.shape({}),
  onContinue: PropTypes.func,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SubTask),
);
