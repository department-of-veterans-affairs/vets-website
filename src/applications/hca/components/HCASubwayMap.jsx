import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export default function HCASubwayMap() {
  return (
    <>
      <h4>Follow the steps below to apply for health care benefits.</h4>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <div>
              <h5>Prepare</h5>
            </div>
            <div>
              <h6>To fill out this application, you’ll need your:</h6>
            </div>
            <ul>
              <li>Social Security number (required)</li>
              <li>
                Copy of your military discharge papers (DD214 or other
                separation documents)
              </li>
              <li>
                Financial information—and your dependents’ financial information
              </li>
              <li>Most recent tax return</li>
              <li>
                Account numbers for any health insurance you currently have
                (such as Medicare, private insurance, or insurance from an
                employer)
              </li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability/get-help-filing-claim/">
                Get help filing your claim
              </a>
              .
            </p>
            <div>
              <h6>Vision and dental benefits</h6>
            </div>
            <p>
              You may qualify for vision and dental benefits as part of your VA
              health care benefits.
            </p>
            <ul>
              <li>
                <strong>Vision benefits.</strong> VA health care covers routine
                eye exams and preventive tests. In some cases, you may get
                coverage for eyeglasses or services for blind or low-vision
                rehabilitation.{' '}
                <a href="/health-care/about-va-health-benefits/vision-care/">
                  Learn more about vision care through VA
                </a>
                .
              </li>
              <li>
                <strong>Dental benefits.</strong> In some cases, you may receive
                dental care as part of your health care benefits.{' '}
                <a href="/health-care/about-va-health-benefits/dental-care/">
                  Learn more about VA dental services
                </a>
                .
              </li>
            </ul>
            <div>
              <h6>Health care priority groups</h6>
            </div>
            <p>
              When you apply for VA health care, we’ll assign you 1 of 8
              priority groups. This system helps to make sure that Veterans who
              need immediate care can get signed up quickly. We assign Veterans
              with service-connected disabilities the highest priority. We
              assign the lowest priority to Veterans who earn a higher income
              and who don’t have any service-connected disabilities.{' '}
              <a href="/health-care/eligibility/#priority-groups">
                Learn more about priority groups
              </a>
              .
            </p>
          </li>
          <li className="process-step list-two">
            <div>
              <h5>Apply</h5>
            </div>
            <p>Complete this health care benefits form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </li>
          <li className="process-step list-three">
            <div>
              <h5>VA Review</h5>
            </div>
            <p>
              We process health care claims within a week. If more than a week
              has passed since you submitted your application and you haven’t
              heard back, please don’t apply again. Call us at{' '}
              <Telephone contact={CONTACTS['222_VETS']} />.
            </p>
          </li>
          <li className="process-step list-four">
            <div>
              <h5>Decision</h5>
            </div>
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </li>
        </ol>
      </div>
    </>
  );
}
