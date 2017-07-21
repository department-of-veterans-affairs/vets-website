import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ReviewCollapsibleChapter from './ReviewCollapsibleChapter';
import SubmitButtons from './SubmitButtons';
import PrivacyAgreement from '../../components/questions/PrivacyAgreement';
import { isValidForm } from '../validation';
import { focusElement, getActivePages } from '../../utils/helpers';
import { createPageListByChapter, expandArrayPages, getPageKeys } from '../helpers';
import { setData, setPrivacyAgreement, setEditMode, setSubmission, submitForm, uploadFile } from '../actions';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class ReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
    // this only needs to be run once
    this.pagesByChapter = createPageListByChapter(this.props.route.formConfig);

    this.state = {
      // we're going to shallow clone this set at times later, but that does not appear
      // to be slower than shallow cloning objects
      viewedPages: new Set(
        getPageKeys(props.route.pageList, props.form.data)
      )
    };
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

  setPagesViewed = (keys) => {
    const viewedPages = keys.reduce((pages, key) => {
      if (!pages.has(key)) {
        // if we hit a page that we need to add, check to see if
        // we haven't cloned the set yet; we should only do that once
        if (pages === this.state.viewedPages) {
          const newPages = new Set(this.state.viewedPages);
          newPages.add(key);

          return newPages;
        }

        pages.add(key);
      }

      return pages;
    }, this.state.viewedPages);

    if (viewedPages !== this.state.viewedPages) {
      this.setState({ viewedPages });
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

  goBack() {
    const { eligiblePageList } = this.getEligiblePages();
    const expandedPageList = expandArrayPages(eligiblePageList, this.props.form.data);
    this.props.router.push(expandedPageList[expandedPageList.length - 2].path);
  }

  handleSubmit() {
    if (isValidForm(this.props.form, this.pagesByChapter)) {
      this.props.submitForm(this.props.route.formConfig, this.props.form);
    } else {
      this.props.setSubmission('hasAttemptedSubmit', true);
    }
  }

  handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index === null ? '' : index}`;
    if (editing) {
      this.setPagesViewed([fullPageKey]);
    }
    this.props.setEditMode(pageKey, editing, index);
  }

  render() {
    const { form } = this.props;
    const formConfig = this.props.route.formConfig;
    return (
      <div>
        <div className="input-section">
          <div>
            {Object.keys(formConfig.chapters).map(chapter => (
              <ReviewCollapsibleChapter
                  key={chapter}
                  onEdit={this.handleEdit}
                  pages={this.pagesByChapter[chapter]}
                  chapterKey={chapter}
                  setData={this.props.setData}
                  setValid={this.props.setValid}
                  uploadFile={this.props.uploadFile}
                  chapter={formConfig.chapters[chapter]}
                  viewedPages={this.state.viewedPages}
                  setPagesViewed={this.setPagesViewed}
                  form={form}/>
            ))}
          </div>
        </div>
        <p><strong>Note:</strong> According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or for providing incorrect information. (See 18 U.S.C. 1001)</p>
        <PrivacyAgreement required
            onChange={this.props.setPrivacyAgreement}
            checked={form.data.privacyAgreementAccepted}
            showError={form.submission.hasAttemptedSubmit}/>
        <SubmitButtons
            errorMessage={formConfig.errorMessage}
            onBack={this.goBack}
            onSubmit={this.handleSubmit}
            submission={form.submission}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

const mapDispatchToProps = {
  setEditMode,
  setSubmission,
  submitForm,
  setPrivacyAgreement,
  setData,
  uploadFile
};

ReviewPage.propTypes = {
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired
  }).isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewPage));

export { ReviewPage };
