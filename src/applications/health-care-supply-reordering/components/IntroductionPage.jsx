import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import UnverifiedPrefillAlert from './UnverifiedPrefillAlert';
import DlcTelephoneLink from './DlcTelephoneLink';
import { datadogActionNames, APP_NAME } from '../constants/datadogConstants';
import { addDatadogAction } from '../utils/datadog';

const IntroductionPage = ({ route }) => {
  const supplyDescription = 'hearing aid or CPAP supplies';

  useEffect(() => {
    addDatadogAction(datadogActionNames.introductionPage.FORM_START, {
      form: APP_NAME,
    });
  }, []);

  return (
    <>
      {' '}
      <FormTitle title="Order hearing aid and CPAP supplies" />
      <div className="vads-u-margin-y--4">
        <p>
          If you receive hearing aid or CPAP supplies from VA, you may be able
          to reorder items like batteries, parts, and accessories. These
          supplies must have been prescribed by a VA provider and received
          within the past 2 years. Each item comes as a 6-month supply and can
          be reordered every 5 months.
        </p>
        <p>
          Right now, only hearing aid and CPAP supplies are available to reorder
          online. If you’d like to order other medical supplies available
          through VA, contact the VA Denver Logistics Center (DLC) at{' '}
          <DlcTelephoneLink /> or email{' '}
          <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>. We’re available
          Monday through Friday, 8:15 a.m. to 5:00 p.m. ET.
        </p>
      </div>
      <DowntimeNotification
        appTitle="Order hearing aid or CPAP supplies"
        dependencies={[externalServices.mdot]}
      >
        <div className="schemaform-intro">
          <SaveInProgressIntro
            hideUnauthedStartLink
            prefillEnabled={route.formConfig.prefillEnabled}
            messages={route.formConfig.savedFormMessages}
            pageList={route.pageList}
            verifyRequiredPrefill={route.formConfig.verifyRequiredPrefill}
            unverifiedPrefillAlert={<UnverifiedPrefillAlert />}
            startText="Start your hearing aid and CPAP supplies order"
            unauthStartText="Sign in to start your order"
            formConfig={route.formConfig}
          >
            Please complete this form to order {supplyDescription}.
          </SaveInProgressIntro>
          <h2
            className="vads-u-font-size--h3"
            itemProp="name"
            id="am-i-eligible-to-order-prosthe"
          >
            How to order your hearing aid or CPAP supplies
          </h2>
          <div className="process schemaform-process">
            <ol>
              <li className="process-step list-one">
                <h3 className="vads-u-font-size--h4">Prepare</h3>
                <p>
                  To place an order, you’ll need to include this information:
                </p>
                <ul>
                  <li>Shipping address</li>
                  <li>Email address</li>
                  <li>
                    Hearing aid information, CPAP device information, or both
                  </li>
                </ul>
              </li>
              <li className="process-step list-two">
                <h3 className="vads-u-font-size--h4">Place your order</h3>
                <p>
                  To place your order, you’ll need to review your personal
                  information. You’ll also need to confirm or update your
                  shipping and email addresses.
                </p>
                <p>
                  Then you’ll select which of these supplies you want to order:
                </p>
                <ul>
                  <li>Hearing aids that need batteries</li>
                  <li>Hearing aid accessories</li>
                  <li>CPAP supplies</li>
                </ul>
                <p>
                  After submitting the order form, you’ll get a confirmation
                  message. You can print this for your records.
                </p>
              </li>
              <li className="process-step list-three">
                <h3 className="vads-u-font-size--h4">Track your order </h3>
                <p>
                  You’ll receive an email with an order tracking number 1 to 2
                  days after you submit your order.
                </p>
              </li>
              <li className="process-step list-four">
                <h3 className="vads-u-font-size--h4">Receive your order</h3>
                <p>
                  You can expect your supplies to arrive in 7 to 10 days. Check
                  your tracking number for the most up-to-date delivery
                  estimate. Orders may take longer if items are out of stock.
                </p>
              </li>
            </ol>
          </div>
          <SaveInProgressIntro
            buttonOnly
            hideUnauthedStartLink
            prefillEnabled={route.formConfig.prefillEnabled}
            messages={route.formConfig.savedFormMessages}
            pageList={route.pageList}
            startText="Start your hearing aid and CPAP supplies order"
            unauthStartText="Sign in to start your order"
            formConfig={route.formConfig}
          />
          <h2 className="vads-u-font-size--h3">Frequently asked questions</h2>
          <va-accordion open-single data-testid="accordion-dropdown">
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                What if I need help or have questions about my order?
              </h3>
              <p>
                If you need help or have questions about your order, contact the
                DLC at <DlcTelephoneLink /> or email{' '}
                <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>. We’re
                available Monday through Friday, 8:15 a.m. to 5:00 p.m. ET.
              </p>
            </va-accordion-item>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                What hearing aid and CPAP supplies can I order online?
              </h3>
              <p>
                At this time, you can only order hearing aid and CPAP supplies
                and accessories online. You may be eligible to reorder these
                supplies:
              </p>
              <strong>Hearing aid supplies:</strong>
              <ul>
                <li>Batteries</li>
                <li>Domes</li>
                <li>Wax guards</li>
                <li>Cleaning supplies</li>
                <li>Desiccant (drying products)</li>
              </ul>
              <strong>CPAP supplies:</strong>
              <ul>
                <li>Chinstrap</li>
                <li>Hoses/tubing</li>
                <li>Filters (disposable and non-disposable)</li>
                <li>Mask with headgear and liners</li>
                <li>Replacement cushions</li>
                <li>Water chamber</li>
                <li>Power accessories (e.g., power cord, SD memory card)</li>
              </ul>
              <p>
                We’ll send you a 6-month supply of each item you add to your
                order. You can only reorder each item once every 5 months. If
                you need an item sooner, call the DLC at <DlcTelephoneLink />,
                Monday through Friday, 8:15 a.m. to 5:00 p.m. ET.
              </p>
            </va-accordion-item>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                Am I eligible to order supplies?
              </h3>
              <p>
                You may be eligible to order certain free medical supplies if
                you meet all of these requirements:
              </p>
              <ul>
                <li>
                  You’re enrolled in VA health care, <strong>and</strong>
                </li>
                <li>
                  You’re registered as a patient at a VA medical center,{' '}
                  <strong>and</strong>
                </li>
                <li>A VA provider prescribed the supplies or medical device</li>
              </ul>
              <p>
                <a href="/health-care/how-to-apply/?postLogin=true">
                  Find out how to apply for VA health care
                </a>
              </p>
              <p>
                <a href="/health-care/order-medical-supplies/">
                  Learn about ordering supplies
                </a>
              </p>
            </va-accordion-item>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                What other medical supplies can I order?
              </h3>
              <p>
                If you have VA prescriptions for other types of medical
                supplies, you may be able to request refills online. You may
                need to pay copays for these other medical supplies.
              </p>
              <p>
                <a href="/health-care/manage-prescriptions-medications/">
                  Learn how to refill and track VA prescriptions
                </a>
              </p>
            </va-accordion-item>
          </va-accordion>
        </div>
      </DowntimeNotification>
    </>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
      verifyRequiredPrefill: PropTypes.bool.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
