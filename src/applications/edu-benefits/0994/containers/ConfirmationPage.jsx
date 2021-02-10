import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import appendQuery from 'append-query';

import { focusElement } from 'platform/utilities/ui';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};
const nextQuery = { next: window.location.pathname };
const url1990 = appendQuery(
  '/education/apply-for-education-benefits/application/1990',
  nextQuery,
);

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  render() {
    const form = this.props.form;
    const { submission, formId } = form;

    const appliedForVaEducationBenefits = _.get(
      form.data,
      'appliedForVaEducationBenefits',
      true,
    );

    return (
      <ConfirmationPageContent
        afterTitleContent={
          <AlertBox
            isVisible={!appliedForVaEducationBenefits}
            status="warning"
            headline="Don’t forget to apply for VA education benefits"
            content={
              <span>
                Now that you've submitted your application for VET TEC, you’ll
                need to complete an Application for VA Education Benefits (VA
                Form 22-1990). Click the button on the bottom of this page to go
                to that application.
              </span>
            }
          />
        }
        additionalGuidance={
          <div>
            {!appliedForVaEducationBenefits && (
              <div className={'apply-for-1990'}>
                <p>
                  <strong>{'Note: '}</strong>
                  We’ll also need you to complete the Application for VA
                  Education Benefits (VA Form 22-1990) to determine your
                  eligibility for VET TEC. We recommend you do that now.
                </p>
                <div className="row form-progress-buttons">
                  <div className="small-6 usa-width-one-half medium-6 columns">
                    <a href={url1990}>
                      <button className="usa-button-primary vettec-1990-button">
                        Continue to VA Form 22-1990
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
        formId={formId}
        submission={submission}
        name={form.data.veteranFullName}
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
