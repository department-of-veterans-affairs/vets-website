import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import formConfig from '../config/form';
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
    const { submission } = form;
    const { benefit } = form.data;
    const response = submission.response ? submission.response.attributes : {};

    return (
      <ConfirmationPageContent
        formConfig={formConfig}
        response={response}
        docExplanation={
          <div className="usa-accordion-content" aria-hidden="false">
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
          </div>
        }
        claimInfoListItems={[
          <li key={'benefit'}>
            <strong>Benefit to be transferred</strong>
            <br />
            {benefitsLabels[benefit]}
          </li>,
        ]}
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
