import React from 'react';
import environment from 'platform/utilities/environment';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export default function HCASubwayMap() {
  return environment.isProduction() ? (
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
              <a href="tel:+18772228387">877-222-8387</a>.
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
  ) : (
    <>
      <h2 className="vads-u-font-size--h3">
        Follow these steps to get started
      </h2>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
            <p>
              Make sure you meet our eligibility requirements for full
              enrollment before you apply.
            </p>
            <p>
              <strong>Note:</strong> We can help connect you with mental health
              care—no matter your discharge status, service history, or
              eligibility for VA health care.{' '}
              <a href="/health-care/health-needs-conditions/mental-health/">
                Find out how to get mental health care
              </a>
            </p>
            <AdditionalInfo triggerText="What are the VA health care eligibility requirements?">
              <p>
                You may be eligible to enroll in VA health care if all of these
                statements are true:
              </p>
              <ul>
                <li>
                  You served in the active military, naval, or air service
                  (including being called up from the National Guard or Reserve
                  by a federal order), <strong>and</strong>
                </li>
                <li>
                  You didn’t receive a dishonorable discharge,{' '}
                  <strong>and</strong>
                </li>
                <li>
                  You meet at least one of the service requirements for
                  enrollment
                </li>
              </ul>

              <p>You must meet at least one of these service requirements:</p>
              <ul>
                <li>
                  You served at least 24 months in a row without a break (called
                  continuous), or for your full active-duty period,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  You were discharged for a service-connected disability,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  You were discharged for a hardship or “early out,”{' '}
                  <strong>or</strong>
                </li>
                <li>You served before September 7, 1980</li>
              </ul>

              <p>
                <strong>Note:</strong> Time spent on active-duty status for
                training purposes only doesn’t count toward the service
                requirements.
              </p>
              <p>
                <a href="/discharge-upgrade-instructions/">
                  Get instructions on how to apply for a discharge upgrade or
                  correction
                </a>
              </p>
            </AdditionalInfo>
          </li>

          <li className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Gather your information</h3>

            <p>Here’s what you’ll need to apply:</p>
            <ul>
              <li>
                <strong>Social Security numbers</strong> for you, your spouse,
                and your qualified dependents.
              </li>
              <li>
                <strong>Your military discharge information.</strong> If you
                sign in to apply, we may be able to fill in this information for
                you. If you don’t sign in to apply, we’ll ask you to upload a
                copy of your DD214 or other separation documents.
              </li>
              <li>
                <strong>Insurance cards</strong> for all insurance companies
                that cover you. This includes any coverage that you get through
                a spouse or significant other. This also includes Medicare,
                private insurance, or insurance from your employer.
              </li>
            </ul>

            <p>We’ll also ask you for this optional information:</p>
            <ul>
              <li>
                <strong>Last year’s gross household income</strong> for you,
                your spouse, and your dependents. This includes income from a
                job and any other sources. Gross household income is your income
                before taxes and any other deductions.
              </li>
              <li>
                <strong>Your deductible expenses for last year.</strong> These
                include certain health care and education costs. These expenses
                will lower the amount of money we count as your income.
              </li>
            </ul>

            <AdditionalInfo triggerText="Why does VA need this information?">
              <p>When you apply, we review this information:</p>
              <ul>
                <li>Your service history</li>
                <li>Your VA disability rating</li>
                <li>
                  Your income level (and the income level of your spouse or
                  other qualified dependents)
                </li>
                <li>
                  Your eligibility for Medicaid, VA disability compensation, and
                  VA pension benefits
                </li>
              </ul>
              <p>We use this information to help us decide these 3 things:</p>
              <ul>
                <li>
                  What types of VA health care benefits you're eligible for,
                  <strong>and</strong>
                </li>
                <li>
                  How soon we can enroll you in VA health care,{' '}
                  <strong>and</strong>
                </li>
                <li>
                  How much (if anything) you’ll have to pay toward the cost of
                  your care
                </li>
              </ul>
              <p>
                We give Veterans with service-connected disabilities the highest
                priority.
              </p>
              <p>
                <strong>Note:</strong> We ask about other health insurance for
                billing only. Having other health insurance doesn’t affect your
                eligibility for VA health care.
              </p>
            </AdditionalInfo>
          </li>

          <li className="process-step list-three">
            <div>
              <h3 className="vads-u-font-size--h4">Start your application</h3>
            </div>
            <p>
              We’ll take you through each step of the process. It should take
              about 30 minutes.
            </p>
            <AdditionalInfo triggerText="What happens after I apply?">
              <p>
                We process health care applications within about a week. We’ll
                send you a letter in the mail with our decision.
              </p>
              <p>
                If you don’t receive your decision letter within a week after
                you apply, please don’t apply again. Call us at{' '}
                <a href="tel:+18772228387">877-222-8387</a> (TTY:{' '}
                <Telephone
                  contact={CONTACTS['711']}
                  pattern={'###'}
                  ariaLabel={'7 1 1.'}
                />
                ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
              </p>
            </AdditionalInfo>
          </li>
        </ol>
      </div>
    </>
  );
}
