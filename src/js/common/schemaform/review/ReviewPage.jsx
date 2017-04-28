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
import { createPageListByChapter } from '../helpers';
import { setData, setPrivacyAgreement, setEditMode, setSubmission, submitForm } from '../actions';

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
    const eligiblePageList = getActivePages(pageList, form);
    const pageIndex = _.findIndex(item => item.pageKey === path, eligiblePageList);
    return { eligiblePageList, pageIndex };
  }

  goBack() {
    const { eligiblePageList, pageIndex } = this.getEligiblePages();
    this.props.router.push(eligiblePageList[pageIndex - 1].path);
  }

  handleSubmit() {
    if (isValidForm(this.props.form, this.pagesByChapter)) {
      this.props.submitForm(this.props.route.formConfig, this.props.form);
    } else {
      this.props.setSubmission('hasAttemptedSubmit', true);
    }
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
                  onEdit={this.props.setEditMode}
                  pages={this.pagesByChapter[chapter]}
                  chapterKey={chapter}
                  setData={this.props.setData}
                  setValid={this.props.setValid}
                  chapter={formConfig.chapters[chapter]}
                  data={form}/>
            ))}
          </div>
        </div>
        <p><strong>Note:</strong> According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or for providing incorrect information. (See 18 U.S.C. 1001)</p>
        <PrivacyAgreement required
            onChange={this.props.setPrivacyAgreement}
            checked={form.privacyAgreementAccepted}
            showError={form.submission.hasAttemptedSubmit}/>
        <SubmitButtons
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
  setData
};

ReviewPage.propTypes = {
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired
  }).isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewPage));

export { ReviewPage };
