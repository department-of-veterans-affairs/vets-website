import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getViewedPages } from '@department-of-veterans-affairs/platform-forms-system/selectors';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import Scroll from 'react-scroll';

import {
  createPageListByChapter,
  getActiveChapters,
  getActiveExpandedPages,
  getPageKeys,
} from '@department-of-veterans-affairs/platform-forms-system/helpers';

import {
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
} from '@department-of-veterans-affairs/platform-forms-system/actions';
import {
  closeReviewChapter,
  openReviewChapter,
  setUpdatedInReview,
} from '../actions';
import ReviewCollapsibleChapter from '../components/ReviewCollapsibleChapter';
import formConfig from '../config/form';
import { getPageKeysForReview } from '../utils/reviewPageHelper';

const { scroller } = Scroll;

const ReviewPage = props => {
  const [showAlert, setShowAlert] = useState(true);
  const dispatch = useDispatch();

  const handlers = {
    onSubmit: () => {
      props.goToPath('/confirmation');
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
      dispatch(closeReviewChapter(name, pageKeys));
    } else {
      dispatch(openReviewChapter(name));
      scrollToChapter(name);
    }
  };

  const handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index === null ? '' : index}`;
    if (editing) {
      props.setViewedPages([fullPageKey]);
      dispatch(setUpdatedInReview(''));
    }
    props.setEditMode(pageKey, editing, index);
    if (!editing) dispatch(setUpdatedInReview(pageKey));
  };

  const handleSetData = (...args) => {
    props.setData(...args);
    if (props.onSetData) {
      props.onSetData();
    }
  };
  return (
    <article>
      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      <div className="vads-u-margin-y--7">
        {showAlert ? (
          <VaAlert
            closeBtnAriaLabel="Close notification"
            closeable
            onCloseEvent={() => setShowAlert(false)}
            status="info"
            uswds
            visible
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              Editing answers
            </h2>
            <div>
              <p className="vads-u-margin-y--0">
                You are only able to edit some answers on this page. You may
                need to return to an earlier page in the form to edit some
                answers.
              </p>
            </div>
          </VaAlert>
        ) : null}
      </div>

      <va-accordion
        bordered
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
        uswds={{
          value: 'true',
        }}
        className="vads-u-width--viewport"
      >
        {props.chapters.map(chapter => {
          return (
            <va-accordion-item
              key={chapter.name}
              header={chapter.formConfig.title}
              id={chapter.name}
            >
              <ReviewCollapsibleChapter
                expandedPages={chapter.expandedPages}
                chapterFormConfig={chapter.formConfig}
                chapterKey={chapter.name}
                form={props.form}
                formContext={props.formContext}
                onEdit={handleEdit}
                open={chapter.open}
                pageKeys={chapter.pageKeys}
                pageList={getPageKeysForReview(formConfig)}
                setData={(...args) => handleSetData(...args)}
                setValid={props.setValid}
                toggleButtonClicked={() => handleToggleChapter(chapter)}
                uploadFile={props.uploadFile}
                viewedPages={new Set(getPageKeysForReview(formConfig))}
                hasUnviewedPages={chapter.hasUnviewedPages}
              />
            </va-accordion-item>
          );
        })}
      </va-accordion>
      <va-button back onClick={() => props.goBack()} />
      <va-button onClick={handlers.onSubmit} text="Submit question" />
    </article>
  );
};

function mapStateToProps(state, ownProps) {
  // from ownprops
  const { formContext } = ownProps;

  // from redux state
  const { form } = state;
  const formData = state.form.data;
  const { openChapters } = state.askVA.reviewPageView;
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
    formContext,
    viewedPages,
    openChapterList: state.askVA.reviewPageView.openChapters,
  };
}

const mapDispatchToProps = {
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
