import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import { benefitsLabels } from '../../utils/labels';
import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
  }

  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  render() {
    const form = this.props.form;
    const { submission, formId } = form;
    const { benefit } = form.data;

    return (
      <ConfirmationPageContent
        claimInfoListItems={[
          <li key={'benefit'}>
            <strong>Benefit to be transferred</strong>
            <br />
            {benefitsLabels[benefit]}
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
              Documents can be uploaded using the{' '}
              <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/account%252">
                GI Bill site
              </a>
              .
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
