import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ReviewPlainChapter from './ReviewPlainChapter';
import {
  mapStateToProps,
  mapDispatchToProps as reviewMapDispatch,
} from './ReviewChapters';
import { setFormErrors } from '../actions';
import { getPageKeys } from '../helpers';

const mapDispatchToProps = {
  ...reviewMapDispatch,
  setFormErrors,
};

class ReviewChaptersPlain extends React.Component {
  componentDidMount() {
    const { formData, pageList } = this.props;
    const viewedPages = new Set(getPageKeys(pageList, formData));
    this.props.setViewedPages(viewedPages);
  }

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
      <div className="form-review-chapters">
        {chapters.map(chapter => (
          <ReviewPlainChapter
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
            reviewEditFocusOnHeaders={formConfig?.reviewEditFocusOnHeaders}
            setData={(...args) => this.handleSetData(...args)}
            uploadFile={this.props.uploadFile}
            viewedPages={viewedPages}
            formOptions={formConfig?.formOptions}
            filterEmptyFields={this.props.filterEmptyFields}
            router={this.props.router}
            location={this.props.location}
            setFormErrors={this.props.setFormErrors}
          />
        ))}
      </div>
    );
  }
}

ReviewChaptersPlain.propTypes = {
  chapters: PropTypes.array.isRequired,
  filterEmptyFields: PropTypes.bool,
  form: PropTypes.object.isRequired,
  formConfig: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  formContext: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onSetData: PropTypes.func,
  pageList: PropTypes.array.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setFormErrors: PropTypes.func.isRequired,
  setViewedPages: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  viewedPages: PropTypes.object.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ReviewChaptersPlain),
);

export { ReviewChaptersPlain };
