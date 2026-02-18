import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { VaAccordion } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollTo } from 'platform/utilities/scroll';
import ReviewCollapsibleChapter from './ReviewCollapsibleChapter';
import {
  createPageListByChapter,
  getActiveExpandedPages,
  getActiveChapters,
  getPageKeys,
} from '../helpers';
import { getReviewPageOpenChapters, getViewedPages } from '../state/selectors';
import {
  closeReviewChapter,
  openReviewChapter,
  toggleAllReviewChapters,
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
} from '../actions';

import { getPageKey } from '../utilities/review';

class ReviewChapters extends React.Component {
  componentDidMount() {
    const { formData, pageList } = this.props;
    const viewedPages = new Set(getPageKeys(pageList, formData));
    this.props.setViewedPages(viewedPages);
  }

  handleToggleChapter = ({ target }) => {
    if (target) {
      const name = target.dataset?.chapter;
      const isOpen = target.getAttribute('open');
      if (isOpen === 'true') {
        this.props.openReviewChapter(name);
        scrollTo(`chapter${name}ScrollElement`);
      } else {
        const chapter = this.props.chapters.find(chapt => chapt.name === name);
        this.props.closeReviewChapter(name, chapter?.pageKeys);
      }
    }
  };

  handleToggleAllChapters = ({ detail }) => {
    const { status } = detail;
    const allOpen = status === 'allOpen';
    const chapterNames = this.props.chapters.reduce((acc, chapter) => {
      acc[chapter.name] = allOpen;
      return acc;
    }, {});
    this.props.toggleAllReviewChapters(chapterNames);
  };

  handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index ?? ''}`;
    if (editing) {
      this.props.setViewedPages([fullPageKey]);
    }
    this.props.setEditMode(pageKey, editing, index);
  };

  handleSetData = (...args) => {
    this.props.setData(...args);
    if (this.props.onSetData) {
      this.props.onSetData();
    }
  };

  render() {
    const {
      chapters,
      form,
      formConfig,
      formContext,
      viewedPages,
      pageList,
    } = this.props;

    return (
      <VaAccordion
        bordered
        onAccordionExpandCollapseAll={this.handleToggleAllChapters}
        onAccordionItemToggled={this.handleToggleChapter}
        uswds
      >
        {chapters.map(chapter => (
          <ReviewCollapsibleChapter
            expandedPages={chapter.expandedPages}
            chapterFormConfig={chapter.formConfig}
            chapterKey={chapter.name}
            form={form}
            reviewErrors={formConfig?.reviewErrors}
            formContext={formContext}
            key={chapter.name}
            onEdit={this.handleEdit}
            open={chapter.open}
            pageKeys={chapter.pageKeys}
            pageList={pageList}
            reviewEditFocusOnHeaders={formConfig?.reviewEditFocusOnHeaders}
            setData={(...args) => this.handleSetData(...args)}
            hasUnviewedPages={chapter.hasUnviewedPages}
            uploadFile={this.props.uploadFile}
            viewedPages={viewedPages}
            formOptions={formConfig?.formOptions}
            filterEmptyFields={this.props.filterEmptyFields}
          />
        ))}
      </VaAccordion>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  // from ownprops
  const { formConfig, formContext, pageList } = ownProps;

  // from redux state
  const { form } = state;
  const formData = form.data;
  const openChapters = getReviewPageOpenChapters(state) || {};
  const viewedPages = getViewedPages(state);

  const chapterNames = getActiveChapters(formConfig, formData);
  const pagesByChapter = createPageListByChapter(formConfig);
  const chapters = chapterNames.map(chapterName => {
    const pages = pagesByChapter[chapterName];

    const expandedPages = getActiveExpandedPages(pages, formData);
    const chapterFormConfig = formConfig.chapters[chapterName];
    const open = openChapters[chapterName] || false;
    const pageKeys = getPageKeys(pages, formData);

    const hasErrors = form.formErrors?.errors?.some(err =>
      pageKeys.includes(getPageKey(err)),
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
    formData,
    formConfig,
    formContext,
    pageList,
    viewedPages,
  };
}

export const mapDispatchToProps = {
  closeReviewChapter,
  openReviewChapter,
  toggleAllReviewChapters,
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
};

ReviewChapters.propTypes = {
  chapters: PropTypes.array.isRequired,
  closeReviewChapter: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  formConfig: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  openReviewChapter: PropTypes.func.isRequired,
  pageList: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setViewedPages: PropTypes.func.isRequired,
  toggleAllReviewChapters: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  viewedPages: PropTypes.object.isRequired,
  formContext: PropTypes.object,
  filterEmptyFields: PropTypes.bool,
  onSetData: PropTypes.func,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ReviewChapters),
);

// for tests
export { ReviewChapters };
