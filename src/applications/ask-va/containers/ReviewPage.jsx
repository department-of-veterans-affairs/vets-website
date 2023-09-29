import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { VaPrivacyAgreement } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ReviewCollapsibleChapter from 'platform/forms-system/src/js/review/ReviewCollapsibleChapter';
// import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import Scroll from 'react-scroll';
// rename taskListPages
import {
  getReviewPageOpenChapters,
  getViewedPages,
} from 'platform/forms-system/src/js/state/selectors';

import {
  createPageListByChapter,
  getActiveExpandedPages,
  getActiveChapters,
  getPageKeys,
} from 'platform/forms-system/src/js/helpers';

import {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
} from 'platform/forms-system/src/js/actions';
import { setupPages } from '../utils/taskListPages';
import formConfig from '../config/form';

const { scroller } = Scroll;

const ReviewPage = props => {
  const [privacyCheckbox, setPrivacyCheckbox] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { getChapterPagesFromChapterIndex } = setupPages(formConfig);
  const chapterClasses = [
    'vads-u-display--flex',
    'vads-u-margin-y--2',
    'vads-u-font-weight--bold',
  ].join(' ');

  const chapterEditLink = (editLink, chapterName) => {
    return (
      <div className={chapterClasses}>
        <Link to={editLink}>{`Return to ${chapterName}`}</Link>
      </div>
    );
  };

  const handlers = {
    onPrivacyCheckboxChange: event => {
      setPrivacyCheckbox(event.detail);
    },
    onSubmit: () => {
      setSubmitted(true);
      if (privacyCheckbox) {
        props.goToPath('/confirmation');
      }
    },
  };

  const scrollToChapter = chapterKey => {
    scroller.scrollTo(
      `chapter${chapterKey}ScrollElement`,
      window.Forms?.scroll || {
        duration: 500,
        delay: 2,
        smooth: true,
      },
    );
  };

  const handleToggleChapter = ({ name, open, pageKeys }) => {
    if (open) {
      props.closeReviewChapter(name, pageKeys);
    } else {
      props.openReviewChapter(name);
      scrollToChapter(name);
    }
  };

  const handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index === null ? '' : index}`;
    if (editing) {
      props.setViewedPages([fullPageKey]);
    }
    props.setEditMode(pageKey, editing, index);
  };

  const handleSetData = (...args) => {
    props.setData(...args);
    if (props.onSetData) {
      props.onSetData();
    }
  };

  // move to utils
  const getPageKeysForReview = config => {
    const pages = Object.entries(config.chapters);
    const titles = pages.map(item => Object.keys(item[1].pages));
    return titles.flat();
  };

  return (
    <article>
      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      <h1>Review Your Ask VA Form</h1>
      <div className="vads-u-margin-bottom--3">
        <va-alert status="info" uswds visible>
          <h2 id="editing-answers" slot="headline">
            Editing answers
          </h2>
          <p className="vads-u-margin-y--0">
            You are only able to edit some answers on this page. You may need to
            return to an earlier page in the form to edit some answers.
          </p>
        </va-alert>
      </div>

      <div className="input-section">
        <div>
          {props.chapters.map((chapter, index) => {
            const pages = getChapterPagesFromChapterIndex(index);
            const editLink = pages[0].path;
            return (
              <div key={chapter.name}>
                <ReviewCollapsibleChapter
                  expandedPages={chapter.expandedPages}
                  chapterFormConfig={chapter.formConfig}
                  chapterKey={chapter.name}
                  form={props.form}
                  //   reviewErrors={formConfig?.reviewErrors}
                  formContext={props.formContext}
                  onEdit={handleEdit}
                  open={chapter.open}
                  pageKeys={chapter.pageKeys}
                  pageList={getPageKeysForReview(formConfig)}
                  setData={(...args) => handleSetData(...args)}
                  setValid={props.setValid}
                  //   hasUnviewedPages={chapter.hasUnviewedPages}
                  toggleButtonClicked={() => handleToggleChapter(chapter)}
                  uploadFile={props.uploadFile}
                  viewedPages={new Set(getPageKeysForReview(formConfig))}
                />
                {pages[0].editModeOnReviewPage &&
                  props.openChapterList.includes(chapter.name) &&
                  chapterEditLink(editLink, chapter.formConfig.title)}
              </div>
            );
          })}
        </div>
      </div>
      <p className="vads-u-margin-top--6">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </p>
      <VaPrivacyAgreement
        onVaChange={handlers.onPrivacyCheckboxChange}
        showError={submitted && !privacyCheckbox}
        uswds
      />
      <p className="vads-u-margin-top--4">
        <Link to="/decision-reviews/appeals-testing">
          Finish this application later
        </Link>
      </p>
      {/* {props.contentBeforeButtons} */}
      <va-button onClick={handlers.onSubmit} text="Submit" />
      {/* <FormNavButtons goBack={props.goBack} goForward={handlers.onSubmit} /> */}
      {/* {props.contentAfterButtons} */}
    </article>
  );
};

function mapStateToProps(state, ownProps) {
  // from ownprops
  const { formContext, pageList } = ownProps;

  // from redux state
  const { form } = state;
  const formData = state.form.data;
  const openChapters = getReviewPageOpenChapters(state);
  const viewedPages = getViewedPages(state);

  const chapterNames = getActiveChapters(formConfig, formData);
  const pagesByChapter = createPageListByChapter(formConfig);
  const chapters = chapterNames.map(chapterName => {
    const pages = pagesByChapter[chapterName];

    const expandedPages = getActiveExpandedPages(pages, formData);
    const chapterFormConfig = formConfig.chapters[chapterName];
    const open = openChapters.includes(chapterName);
    const pageKeys = getPageKeys(pages, formData);

    const hasErrors = state.form.formErrors?.errors?.some(err =>
      pageKeys.includes(err.pageKey),
    );
    // review this when adding this to app
    const hasUnviewedPages =
      hasErrors || pageKeys.some(key => !viewedPages.has(key));

    return {
      expandedPages: expandedPages.map(
        page =>
          page.appStateSelector
            ? { ...page, appStateData: page.appStateSelector(state) }
            : page,
      ),
      formConfig: chapterFormConfig,
      name: chapterName,
      open,
      pageKeys,
      hasUnviewedPages,
    };
  });

  return {
    chapters,
    form,
    formData,
    formContext,
    pageList,
    viewedPages,
    openChapterList: state.form.reviewPageView.openChapters,
  };
}

const mapDispatchToProps = {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
};

// refactor proptypes
ReviewPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    veteran: PropTypes.shape({
      homePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
      mobilePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  name: PropTypes.string,
  pagePerItemIndex: PropTypes.number,
  schema: PropTypes.shape({}),
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  uiSchema: PropTypes.shape({}),
  updatePage: PropTypes.func,
  uploadFile: PropTypes.func,
  onChange: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
