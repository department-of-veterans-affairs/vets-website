import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import EducationModalContent from 'platform/forms/components/OMBInfoModalContent/EducationModalContent';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import environment from 'platform/utilities/environment';
import PageLink from '../components/PageLink';
import Lists from '../components/Lists';
import { complaintList, complaintTypesList, prepareList } from '../constants';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="GI Bill® School Feedback Tool" />
        <p>
          If you have an issue or complaint about a school or training facility
          that’s eligible to receive GI Bill benefits, you can submit feedback
          to VA. You can submit feedback to us if your school isn’t following
          the{' '}
          <PageLink
            text="Principles of Excellence"
            href="https://benefits.va.gov/gibill/principles_of_excellence.asp"
            target="_blank"
          />{' '}
          guidelines or if you have any other concerns or issues you’d like to
          raise with us. Your feedback tells us about practices that may pose
          risks to students.
        </p>
        <p>VA will review the following types of complaints:</p>
        <Lists items={complaintTypesList} />
        <p>
          Questions about your eligibility and payments under the GI Bill should
          be directed to the <br />
          <PageLink
            text="&quot;Ask VA&quot;"
            href="https://ask.va.gov/"
            target="_blank"
          />{' '}
          section of our website.
        </p>
        <p>
          If you are not using VA education benefits please submit your
          complaint with the appropriate agency:
        </p>
        <Lists items={complaintList} />

        <p>
          You can choose to submit your feedback anonymously or on behalf of
          someone else. We share all information with the school, but if you
          submit feedback anonymously we won’t share your name with the school.
        </p>
        <p>
          Get started right now by filling out a short form. Follow the steps
          below.
        </p>
        <SaveInProgressIntro
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          startText="Submit Your Feedback"
        />
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div>
                <h5>Prepare</h5>
              </div>
              <div>
                <h6>To fill out this form, you’ll need to:</h6>
              </div>
              <Lists items={prepareList} />
            </li>
            <li className="process-step list-two">
              <div>
                <h5>Submit Your Feedback</h5>
              </div>
              <p>Fill out and submit this feedback form.</p>
            </li>
            <li className="process-step list-three">
              <div>
                <h5>VA Review</h5>
              </div>
              <p>
                We’ll review your feedback and send it to your school for their
                review and to provide a response to your feedback. Feedback that
                isn’t related to VA education benefits may be forwarded to
                another agency for review.
              </p>
            </li>
            <li className="process-step list-four">
              <div>
                <h5>VA Processing</h5>
              </div>
              <p>
                When the school provides a response to your feedback it will be
                reviewed and sent to you.
              </p>
            </li>
          </ol>
        </div>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          {environment.isProduction() ? (
            <va-omb-info
              res-burden={15}
              omb-number="2900-0797"
              exp-date="11/30/2027"
            />
          ) : (
            <va-omb-info
              res-burden={15}
              omb-number="2900-0797"
              exp-date="11/30/2027"
            >
              <EducationModalContent resBurden={15} ombNumber="2900-0797" />
            </va-omb-info>
          )}
        </div>
      </div>
    );
  }
}

export default IntroductionPage;

export { IntroductionPage };
