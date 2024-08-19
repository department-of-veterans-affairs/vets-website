import React from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { getListOfBenefits } from '../../utils/helpers';
import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }

  makeList(arr) {
    if (arr && arr.length) {
      return (
        <ul className="claim-list">
          {arr.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      );
    }
    return null;
  }

  render() {
    const { form } = this.props;
    const { submission, formId } = form;
    const benefits = form.data['view:selectedBenefits'];

    return (
      <ConfirmationPageContent
        claimInfoListItems={[
          <li key="benefit">
            <strong>Benefit claimed</strong>
            <br />
            {this.makeList(getListOfBenefits(benefits))}
          </li>,
        ]}
        docExplanationHeader="No documents required at this time"
        docExplanation={
          <>
            <p>In the future, you might need:</p>
            <ul>
              <li>Your reserve kicker</li>
              <li>
                Documentation of additional contributions that would increase
                your monthly benefits
              </li>
            </ul>
            <p>
              <a href="/contact-us/">
                You can update your documents online through Ask VA
              </a>
            </p>
          </>
        }
        formId={formId}
        name={form.data.veteranFullName}
        submission={submission}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };
