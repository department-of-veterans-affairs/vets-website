import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReviewCollapsibleChapter from './ReviewCollapsibleChapter';
import {
  createPageListByChapter,
  expandArrayPages,
  getActiveChapters,
  getPageKeys
} from '../helpers';
import {
  getReviewPageOpenChapters,
  getViewedPages
} from '../state/selectors';
import { getActivePages } from '../../../../platform/forms/helpers';
import {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setEditMode,
  setViewedPages,
  uploadFile
} from '../actions';

class ReviewChapters extends React.Component {

  componentDidMount() {
    const pageList = this.props.pageList;
    const form = this.props.form;

    this.props.setViewedPages(new Set(getPageKeys(pageList, form)));
  }

  handleToggleChapter({ name, open, pageKeys }) {
    if (open) {
      this.props.closeReviewChapter(name, pageKeys);
    } else {
      this.props.openReviewChapter(name);
    }
  }

  handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index === null ? '' : index}`;
    if (editing) {
      this.props.setViewedPages([fullPageKey]);
    }
    this.props.setEditMode(pageKey, editing, index);
  }

  render() {
    const {
      chapters,
      form,
      formContext,
      setValid,
      viewedPages
    } = this.props;

    return (
      <div className="input-section">
        <div>
          {chapters.map(chapter => (
            <ReviewCollapsibleChapter
              expandedPages={chapter.expandedPages}
              chapterFormConfig={chapter.formConfig}
              chapterKey={chapter.name}
              form={form}
              formContext={formContext}
              key={chapter.name}
              onEdit={this.handleEdit}
              open={chapter.open}
              pageKeys={chapter.pageKeys}
              setData={this.props.setData}
              setValid={setValid}
              showUnviewedPageWarning={chapter.showUnviewedPageWarning}
              toggleButtonClicked={() => this.handleToggleChapter(chapter)}
              uploadFile={this.props.uploadFile}
              viewedPages={viewedPages}/>
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  // from ownprops
  const {
    formConfig,
    formContext,
    pageList
  } = ownProps;

  // from redux state
  const form = state.form;
  const formData = state.form.data;
  const openChapters = getReviewPageOpenChapters(state);
  const viewedPages = getViewedPages(state);

  const chapterNames = getActiveChapters(formConfig, formData);
  const disableSave = formConfig.disableSave;
  const pagesByChapter = createPageListByChapter(formConfig);
  const chapters = chapterNames.reduce((chaptersAcc, chapterName) => {
    const pages = pagesByChapter[chapterName];

    const activePages = getActivePages(pages, formData);
    const expandedPages = expandArrayPages(activePages, formData);
    const chapterFormConfig = formConfig.chapters[chapterName];
    const open = openChapters.includes(chapterName);
    const pageKeys = getPageKeys(pages, formData);
    const showUnviewedPageWarning = pageKeys.some(key => !viewedPages.has(key));

    chaptersAcc.push({
      expandedPages,
      formConfig: chapterFormConfig,
      name: chapterName,
      open,
      pageKeys,
      showUnviewedPageWarning
    });

    return chaptersAcc;
  }, []);

  return {
    chapters,
    disableSave,
    form,
    formConfig,
    formContext,
    pageList,
    viewedPages
  };
}

const mapDispatchToProps = {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setEditMode,
  setViewedPages,
  uploadFile
};

ReviewChapters.propTypes = {
  chapters: PropTypes.array.isRequired,
  closeReviewChapter: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  formConfig: PropTypes.object.isRequired,
  formContext: PropTypes.object,
  openReviewChapter: PropTypes.func.isRequired,
  pageList: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setViewedPages: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  viewedPages: PropTypes.array.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewChapters));

// for tests
export { ReviewChapters };
