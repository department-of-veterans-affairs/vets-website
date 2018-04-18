import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import recordEvent from '../../../../platform/monitoring/record-event';

import ReviewCollapsibleChapter from './ReviewCollapsibleChapter';

import { focusElement } from '../../../../platform/utilities/ui';
import { getActivePages } from '../../../../platform/forms/helpers';
import {
  createPageListByChapter,
  expandArrayPages,
  getActiveChapters
} from '../helpers';
import { getReviewPageOpenChapters } from '../state/selectors';
import {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setPrivacyAgreement,
  setEditMode,
  setSubmission,
  submitForm,
  uploadFile
} from '../actions';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class ReviewPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    scrollToTop();
    focusElement('h4');
  }

  componentWillReceiveProps(nextProps) {
    const nextStatus = nextProps.form.submission.status;
    const previousStatus = this.props.form.submission.status;
    if (nextStatus !== previousStatus && nextStatus === 'applicationSubmitted') {
      this.props.router.push(`${nextProps.route.formConfig.urlPrefix}confirmation`);
    }
  }

  /*
   * Returns the page list without conditional pages that have not satisfied
   * their dependencies and therefore should be skipped.
   */
  getEligiblePages() {
    const { form, route: { pageList, path } } = this.props;
    const eligiblePageList = getActivePages(pageList, form.data);
    const pageIndex = _.findIndex(item => item.pageKey === path, eligiblePageList);
    return { eligiblePageList, pageIndex };
  }

  handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index === null ? '' : index}`;
    if (editing) {
      this.props.setPagesViewed([fullPageKey]);
    }
    this.props.setEditMode(pageKey, editing, index);
  }

  handleToggleChapter(toggledChapter) {
    if (this.props.openChapters.includes(toggledChapter)) {
      this.props.closeReviewChapter(toggledChapter);
    } else {
      this.props.openReviewChapter(toggledChapter);
    }
  }

  render() {
    const {
      route,
      form,
      formConfig,
      formContext,
      contentAfterButtons,
      renderErrorMessage,
    } = this.props;
    const chapters = getActiveChapters(formConfig, form.data);

    return (
      <div>
        <div className="input-section">
          <div>
            {chapters.map(chapter => (
              <ReviewCollapsibleChapter
                key={chapter}
                onEdit={this.handleEdit}
                toggleButtonClicked={() => this.handleToggleChapter(chapter)}
                open={this.props.openChapters.includes(chapter)}
                pages={this.props.pagesByChapter[chapter]}
                chapterKey={chapter}
                setData={this.props.setData}
                setValid={this.props.setValid}
                uploadFile={this.props.uploadFile}
                chapter={formConfig.chapters[chapter]}
                viewedPages={this.props.viewedPages}
                setPagesViewed={this.props.setPagesViewed}
                formContext={formContext}
                form={form}/>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    test: true
  };
}

const mapDispatchToProps = {
};

ReviewPage.propTypes = {
  closeReviewChapter: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  formContext: PropTypes.object,
  openChapters: PropTypes.array.isRequired,
  openReviewChapter: PropTypes.func.isRequired,
  renderErrorMessage: PropTypes.func,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired
  }).isRequired,
  pagesByChapter: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setSubmission: PropTypes.func.isRequired,
  setPrivacyAgreement: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewPage));

export { ReviewPage };
