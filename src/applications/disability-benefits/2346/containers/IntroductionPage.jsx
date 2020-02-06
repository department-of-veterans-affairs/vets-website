import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { getUserInformation } from '../api';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');

    getUserInformation().then(data => {
      if (data.error) {
        // eslint-disable-next-line no-console
        console.log(data.error);
      } else {
        // eslint-disable-next-line no-console
        console.log(data);
      }
    });
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Order hearing aid batteries and prosthetic socks from VA" />
        <div className="va-introtext">
          <p>
            Find out if you may be eligible to order free hearing aid batteries
            or prosthetic socks, and how to order this medical equipment online
            or by mail or phone.
          </p>
        </div>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        >
          Please complete the 2346 form to apply for ordering hearing aid
          batteries and accessories.
        </SaveInProgressIntro>
        <div itemScope="" itemType="http://schema.org/Question">
          <h2 itemProp="name" id="am-i-eligible-to-order-hearing">
            Am I eligible to order hearing aid batteries online from VA?
          </h2>
          <div
            itemProp="acceptedAnswer"
            itemScope=""
            itemType="http://schema.org/Answer"
          >
            <div itemProp="text">
              <div className="processed-content">
                <p>
                  You can order hearing aid batteries from us if you meet all of
                  the requirements listed below.
                </p>

                <p>
                  <strong>All of these must be true:</strong>
                </p>

                <ul>
                  <li>
                    You’re enrolled in VA health care, <strong>and</strong>
                  </li>
                  <li>
                    You’re registered as a patient at a VA medical center,
                    <strong>and</strong>
                  </li>
                  <li>
                    Your VA audiologist has recommended hearing aids or other
                    hearing assisted devices
                  </li>
                </ul>
                <p>
                  <a href="/health-care/apply/application/">
                    Find out how to apply for VA health care
                  </a>
                </p>

                <p>
                  <strong>
                    And you’ll need to have a Premium <strong>DS Logon</strong>
                    account
                  </strong>{' '}
                  (used for eBenefits and milConnect).
                </p>
                <p>
                  If you don’t have a Premium DS Logon account, find out how to
                  create or upgrade an account on eBenefits.
                  <br />
                  <a
                    href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=hearing-aid-batteries-and-prosthetic-socks"
                    // eslint-disable-next-line react/jsx-no-target-blank
                    target="_blank"
                    rel="noopener "
                  >
                    Go to eBenefits
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div itemScope="" itemType="http://schema.org/Question">
          <h2 itemProp="name" id="am-i-eligible-to-order-prosthe">
            Am I eligible to order prosthetic socks online from VA?
          </h2>
          <div
            itemProp="acceptedAnswer"
            itemScope=""
            itemType="http://schema.org/Answer"
          >
            <div itemProp="text">
              <div className="processed-content">
                <p>
                  You can order prosthetic socks from us online if you meet all
                  of the requirements listed below.
                </p>

                <p>
                  <strong>All of these must be true:</strong>
                </p>

                <ul>
                  <li>
                    You’re enrolled in VA health care, <strong>and</strong>
                  </li>
                  <li>
                    You’re registered as a patient at a VA medical center,
                    <strong>and</strong>
                  </li>
                  <li>
                    Your VA health care provider has authorized you to receive
                    prosthetic socks
                  </li>
                </ul>
                <p>
                  <a href="/health-care/apply/application/">
                    Find out how to apply for VA health care
                  </a>
                </p>

                <p>
                  <strong>
                    And you’ll need to have a Premium DS Logon account
                  </strong>{' '}
                  (used for eBenefits and milConnect).
                </p>
                <p>
                  If you don’t have a Premium <strong>DS Logon</strong> account,
                  find out how to create or upgrade an account on eBenefits.
                  <br />
                  <a
                    href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=hearing-aid-batteries-and-prosthetic-socks"
                    // eslint-disable-next-line react/jsx-no-target-blank
                    target="_blank"
                    rel="noopener "
                  >
                    Go to eBenefits
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div itemScope="" itemType="http://schema.org/Question">
          <h2 itemProp="name" id="are-my-hearing-aid-batteries-o">
            Are my hearing aid batteries or prosthetic socks free of charge?
          </h2>
          <div
            itemProp="acceptedAnswer"
            itemScope=""
            itemType="http://schema.org/Answer"
          >
            <div itemProp="text">
              <div className="processed-content">
                <p>
                  <strong>
                    You can get these items free of charge as long as:
                  </strong>
                </p>

                <ul>
                  <li>
                    Your VA health care provider has recommended them for you,{' '}
                    <strong>and</strong>
                  </li>
                  <li>
                    You remain eligible for and enrolled in VA health care
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <h2>Once I’m signed in to eBenefits, how do I place my order?</h2>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <p>
                Click on the eBenefits logo in the upper left corner of the page
                to go to the site’s homepage.
              </p>
            </li>
            <li className="process-step list-two">
              <p>
                Look for the “Manage Health” category, and click on the link
                “Hearing Aid Batteries and Prosthetic Socks.” You’ll go to a new
                page.
              </p>{' '}
            </li>
            <li className="process-step list-three">
              <p>
                Look for the section titled “Select What You Would Like to
                Order,” and click on the item you want. You’ll go to a new page.
              </p>{' '}
            </li>
            <li className="process-step list-four">
              <p>
                Fill out the form with the required information (last name, last
                4 digits of your Social Security number, date of birth). You can
                also provide your email if you'd like. Then you’ll be taken to a
                page where you can order the product you need.
              </p>
            </li>
            <li className="process-step list-five">
              <p>Select the product you need, and submit your order.</p>
            </li>
            <li className="process-step list-six">
              <p>
                eBenefits will send a confirmation email to the address we have
                on file once your order is processed. If there are any issues
                with your order, you’ll receive an error message with
                instructions for how to get help.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="mdt-2346" expDate="12/31/2222" />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
