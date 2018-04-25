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
import { getFormContext } from '../save-in-progress/selectors';

class ReviewChapters extends React.Component {
  render() {
    const {
      chapters,
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
              setData={this.setData}
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
  const { formConfig, pageList } = ownProps;

  // from redux state
  const form = state.form;
  const formData = state.form.data;
  const openChapters = getReviewPageOpenChapters(state);
  const user = state.user;
  const viewedPages = getViewedPages(state);

  const chapterNames = getActiveChapters(formConfig, formData);
  const disableSave = formConfig.disableSave;
  const formContext = getFormContext({ form, user });
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
    pagesByChapter,
    user,
    viewedPages
  };
}

const mapDispatchToProps = {
};

ReviewChapters.propTypes = {
  closeReviewChapter: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired
  }).isRequired,
  openChapters: PropTypes.array.isRequired,
  openReviewChapter: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setSubmission: PropTypes.func.isRequired,
  setPrivacyAgreement: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.element,
  renderErrorMessage: PropTypes.func,
  formContext: PropTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewChapters));
