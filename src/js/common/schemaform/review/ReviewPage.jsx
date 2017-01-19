import React from 'react';
import { connect } from 'react-redux';

import ReviewCollapsibleChapter from './ReviewCollapsibleChapter';
import SubmitButtons from './SubmitButtons';
import PrivacyAgreement from '../../components/questions/PrivacyAgreement';
import { createPageListByChapter, isValidForm } from '../helpers';
import { setPrivacyAgreement, setEditMode, setSubmission, submitForm } from '../actions';

export class ReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this only needs to be run once
    this.pagesByChapter = createPageListByChapter(this.props.formConfig);
  }

  handleSubmit() {
    if (this.props.form.privacyAgreementAccepted && isValidForm(this.props.form)) {
      this.props.submitForm(this.props.formConfig, this.props.form);
    } else {
      this.props.setSubmission('hasAttemptedSubmit', true);
    }
  }

  render() {
    const { form, formConfig } = this.props;
    return (
      <div>
        <h4 className="edu-page-title">Review application</h4>
        <div className="input-section">
          <div>
            {Object.keys(formConfig.chapters).map(chapter => (
              <ReviewCollapsibleChapter
                  key={chapter}
                  onEdit={this.props.setEditMode}
                  pages={this.pagesByChapter[chapter]}
                  chapterKey={chapter}
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
            onSubmit={this.handleSubmit}
            submission={form.submission}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    form: state.form,
    formConfig: ownProps.route.formConfig
  };
}

const mapDispatchToProps = {
  setEditMode,
  setSubmission,
  submitForm,
  setPrivacyAgreement
};

ReviewPage.propTypes = {
  formConfig: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewPage);
