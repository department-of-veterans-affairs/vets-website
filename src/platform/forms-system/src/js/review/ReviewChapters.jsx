import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ReviewCollapsibleChapter from './ReviewCollapsibleChapter';
import {
  createPageListByChapter,
  getActiveExpandedPages,
  getActiveChapters,
  getPageKeys,
} from '../helpers';
import { getViewedPages } from '../state/selectors';
import { setData, setEditMode, setViewedPages, uploadFile } from '../actions';

class ReviewChapters extends React.Component {
  componentDidMount() {
    const { formData, pageList } = this.props;
    const viewedPages = new Set(getPageKeys(pageList, formData));
    this.props.setViewedPages(viewedPages);
  }

  handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index === null ? '' : index}`;
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
      <va-accordion bordered>
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
            pageKeys={chapter.pageKeys}
            pageList={pageList}
            setData={(...args) => this.handleSetData(...args)}
            hasUnviewedPages={chapter.hasUnviewedPages}
            uploadFile={this.props.uploadFile}
            viewedPages={viewedPages}
          />
        ))}
      </va-accordion>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  // from ownprops
  const { formConfig, formContext, pageList } = ownProps;

  // from redux state
  const { form } = state;
  const formData = state.form.data;
  const viewedPages = getViewedPages(state);

  const chapterNames = getActiveChapters(formConfig, formData);
  const pagesByChapter = createPageListByChapter(formConfig);
  const chapters = chapterNames.map(chapterName => {
    const pages = pagesByChapter[chapterName];

    const expandedPages = getActiveExpandedPages(pages, formData);
    const chapterFormConfig = formConfig.chapters[chapterName];
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

const mapDispatchToProps = {
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
};

ReviewChapters.propTypes = {
  chapters: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  formConfig: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setViewedPages: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  viewedPages: PropTypes.object.isRequired,
  formContext: PropTypes.object,
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
