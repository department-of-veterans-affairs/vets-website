import _ from 'lodash/fp';
import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

import { getListOfBenefits } from '../../utils/helpers';
import { benefitsRelinquishmentLabels } from '../helpers';
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
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
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
    const form = this.props.form;
    const { submission, formId } = form;
    const benefits = form.data['view:selectedBenefits'];
    const benefitsRelinquished = _.get(
      'data.view:benefitsRelinquishedContainer.benefitsRelinquished',
      form,
    );

    return (
      <ConfirmationPageContent
        claimInfoListItems={[
          <li key={'benefit'}>
            <strong>Benefit claimed</strong>
            <br />
            {this.makeList(getListOfBenefits(benefits))}
            {benefits.chapter33 && (
              <div className="claim-relinquished">
                <span>
                  <i>Relinquished:</i>
                </span>
                {this.makeList([
                  benefitsRelinquishmentLabels[benefitsRelinquished],
                ])}
              </div>
            )}
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
