import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import React from 'react';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import formConfig from '../config/form';
import UnverifiedPrefillAlert from './UnverifiedPrefillAlert';

const IntroductionPage = props => {
  // Toggle from hearing aid supplies to hearing aid + CPAP supplies.
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const toggleName = TOGGLE_NAMES.supplyReorderingSleepApneaEnabled;
  const isSupplyReorderingSleepApneaEnabled = useToggleValue(toggleName);
  const isLoadingFeatureFlags = useToggleLoadingValue(toggleName);
  const supplyDescription = isSupplyReorderingSleepApneaEnabled
    ? 'hearing aid or CPAP supplies'
    : 'hearing aid batteries and accessories';
  if (isLoadingFeatureFlags)
    return <va-loading-indicator message="Loading your information..." />;

  return (
    <>
      {' '}
      <FormTitle title={`Order ${supplyDescription}`} />
      <DowntimeNotification
        appTitle="Order hearing aid or CPAP supplies"
        dependencies={[externalServices.mdot]}
      >
        <div className="schemaform-intro">
          <SaveInProgressIntro
            hideUnauthedStartLink
            prefillEnabled={props.route.formConfig.prefillEnabled}
            messages={props.route.formConfig.savedFormMessages}
            pageList={props.route.pageList}
            verifyRequiredPrefill={props.route.formConfig.verifyRequiredPrefill}
            unverifiedPrefillAlert={<UnverifiedPrefillAlert />}
            startText={`Order ${supplyDescription}`}
            unauthStartText="Sign in to start your order"
            formConfig={formConfig}
          >
            Please complete this form to order {supplyDescription}.
          </SaveInProgressIntro>
          <h2
            className="vads-u-font-size--h3"
            itemProp="name"
            id="am-i-eligible-to-order-prosthe"
          >
            Follow the steps below to order {supplyDescription}.
          </h2>
          <div className="process schemaform-process">
            <ol>
              <li className="process-step list-one">
                <h3 className="vads-u-font-size--h4">Prepare</h3>
                <p>To place an order, you’ll need your:</p>
                <ul>
                  <li>Shipping address</li>
                  <li>Email address</li>
                  <li>Hearing aid information</li>
                  <li>CPAP machine information</li>
                </ul>
                <p className="vads-u-font-weight--bold">
                  What if I need help with my order?
                </p>
                <p>
                  If you need help ordering {supplyDescription}, you can call
                  the Denver Logistics Center Customer Service Section at{' '}
                  <va-telephone contact="3032736200" /> or email{' '}
                  <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
                </p>
              </li>
              <li className="process-step list-two">
                <h3 className="vads-u-font-size--h4">Place your order</h3>
                <p>Complete this {supplyDescription} order form.</p>
                <p>These are the steps you can expect when placing an order:</p>
                <ul>
                  <li>Confirm your personal information</li>
                  <li>
                    Confirm or edit your shipping address and email address
                  </li>
                  <li>Select any hearing aids that need batteries</li>
                  <li>Select any hearing aid accessories you need</li>
                  {isSupplyReorderingSleepApneaEnabled && (
                    <li>Select any CPAP supplies you need</li>
                  )}
                  <li>Review and submit order</li>
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
                  You should receive your order within the time frame shown on
                  your order tracking number.
                </p>
                <p className="vads-u-font-weight--bold">
                  What if I have questions about my order?
                </p>
                <p>
                  If you have questions about your order, you can call the DLC
                  Customer Service Section at{' '}
                  <va-telephone contact="3032736200" /> or email{' '}
                  <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
                </p>
              </li>
            </ol>
          </div>
          <SaveInProgressIntro
            buttonOnly
            hideUnauthedStartLink
            prefillEnabled={props.route.formConfig.prefillEnabled}
            messages={props.route.formConfig.savedFormMessages}
            pageList={props.route.pageList}
            startText={`Order ${supplyDescription}`}
            unauthStartText="Sign in to start your order"
            formConfig={formConfig}
          />
        </div>
      </DowntimeNotification>
    </>
  );
};

export default IntroductionPage;
