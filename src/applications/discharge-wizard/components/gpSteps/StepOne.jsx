import React from 'react';
import PropTypes from 'prop-types';
import AlertMessage from '../AlertMessage';
import { board, formData } from '../../helpers';

const StepOne = ({ formValues }) => {
  const questionOneResponse = formValues['4_reason'];
  const specReason = ['1', '2', '4'].indexOf(questionOneResponse) > -1;
  const boardToSubmit = board(formValues);
  /* eslint-disable quote-props */
  const reasons = {
    '1': {
      name: 'PTSD or other mental health conditions',
      type: 'condition',
    },
    '2': {
      name: 'TBI',
      type: 'condition',
    },
    '4': {
      name: 'sexual assault',
      type: 'experience',
    },
  };

  /* eslint-enable quote-props */
  const strongCaseTips = () => {
    if (specReason) {
      return (
        <div>
          <span>
            For discharges related to {reasons[questionOneResponse].name}, be
            sure to answer these questions to make the strongest case:
          </span>
          <ul>
            <li>
              Did you have{' '}
              {reasons[questionOneResponse].type === 'experience' ? 'an' : 'a'}{' '}
              {reasons[questionOneResponse].type} that may explain or contribute
              to the discharge?
            </li>
            <li>
              Did that {reasons[questionOneResponse].type}{' '}
              {questionOneResponse === '4' ? 'happen' : 'start or get worse'}{' '}
              during your military service?
            </li>
            <li>
              Why does the {reasons[questionOneResponse].type} directly explain
              or contribute to the discharge?
            </li>
            <li>
              Why does the {reasons[questionOneResponse].type} carry more weight
              than any other reasons you may have been discharged for?
            </li>
          </ul>
        </div>
      );
    }
    return null;
  };

  const dd214Tips = (
    <ul>
      <li>
        Pay special attention to item 6, which asks for the reason for your
        change. Here you should explain why you need a new DD214, including any
        problems you face when you have to show both the DD214 and the DD215.
        You may want to consider attaching additional pages to fully answer this
        question.
      </li>
    </ul>
  );

  const nonDd2014Tips = (
    <ul>
      <li>
        Pay special attention to item 6, which asks for the reason for your
        change. Most Veterans attach additional pages to answer this question.{' '}
        {strongCaseTips()}
      </li>
      {formValues['10_prevApplicationType'] === '3' && (
        <li>
          Because you’re applying for reconsideration of a previous application,
          you’ll need to enter the previous application number in Item 6b.{' '}
          <strong>Note:</strong> You’re generally only eligible for
          reconsideration if you have new evidence to present that wasn’t
          available when you applied last time. Make sure you’re clear about
          exactly what that new evidence is. Additionally, changes in DoD
          policy, like the new consideration guidelines for PTSD, TBI, and
          sexual assault or harassment, can qualify you for reconsideration.
        </li>
      )}
      {formValues['4_reason'] === '4' && (
        <li>
          Note: For upgrades related to sexual assault or harassment, you do not
          need to prove the original assault or harassment occurred—meaning if
          you didn’t file charges or report the incident, you can still apply
          for an upgrade. The important part of your application is where you
          explain the impact of the incident on your service. For example,
          detail how the incident caused a decrease in your productivity, or was
          the reason for PTSD.
        </li>
      )}
      {boardToSubmit.abbr !== 'DRB' && (
        <li>
          Item 8 asks for the date when you discovered the error or injustice
          you’re asking the Board to address. If it’s been more than 3 years
          since you found this error or injustice, you’ll need to include a
          reason why the Board should consider your application. Examples of
          good reasons include new evidence you’ve found to support your claim,
          or recent changes in policy (like liberal consideration for PTSD, TBI,
          or military sexual assault or harassment). These kinds of reasons will
          make it more likely for the Board to decide in your favor. The 3-year
          time limit isn’t a strict rule, so don’t let it keep you from applying
          if you think you have a strong case.
        </li>
      )}
      {boardToSubmit.abbr !== 'DRB' && (
        <li>
          Item 10 asks if you’re willing to appear in person before the Board in
          Washington, DC. The Board rarely asks Veterans to appear in person,
          but if you say you’re willing to do so, it may help show how serious
          you are about your case.
        </li>
      )}
      {boardToSubmit.abbr === 'DRB' &&
        formValues['10_prevApplicationType'] !== '1' && (
          <li>
            You can request either a Documentary Review or Personal Appearance
            Review from the Discharge Review Board (DRB). If your case is
            especially complicated and requires detailed explanation, you{' '}
            <strong>may</strong> have more success with a Personal Appearance
            Review. Note that you’ll have to pay your travel costs if you make a
            personal appearance. Documentary Reviews are generally faster, so we
            recommend you begin with this type of review. Also, if you’re denied
            in a Documentary Review, you can then appeal through a Personal
            Appearance Review. But you can’t request Documentary Review after a
            Personal Appearance Review.
          </li>
        )}
      {boardToSubmit.abbr === 'DRB' &&
        formValues['10_prevApplicationType'] === '1' && (
          <li>
            The DRB allows you to request either a Documentary Review or a
            Personal Appearance Review. Because your application was already
            denied during a Documentary Review, you must apply for a Personal
            Appearance Review in Washington, DC. Note that you will have to pay
            your travel costs if you make a personal appearance.
          </li>
        )}
    </ul>
  );

  const form = formData(formValues);
  const header = `Download and fill out DoD Form ${form.num}`;

  return (
    <va-process-list-item header={header}>
      <p>Important tips for completing Form {form.num}:</p>
      {formValues['4_reason'] === '8' ? dd214Tips : nonDd2014Tips}
      <va-link
        class="vads-u-display--block vads-u-margin-bottom--1"
        download
        filetype="PDF"
        href={form.link}
        text={`Download Form ${form.num}`}
      />
      <AlertMessage
        content={
          <>
            <h4 className="usa-alert-heading">
              Need help preparing your application?
            </h4>
            <p>
              The process of preparing a discharge upgrade or correction
              application can be a lot of work and can take a long time.
              Although many Veterans are successful on their own, you may want
              to consider finding someone to advocate for you in this process.
              Try a Veterans Service Organization (VSO), search online for a
              lawyer who may provide services for low or no cost, or ask other
              Veterans for recommendations.{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.benefits.va.gov/vso/varo.asp"
              >
                Find a VSO near you
              </a>
              .
            </p>
          </>
        }
        isVisible
        status="warning"
      />
    </va-process-list-item>
  );
};

StepOne.propTypes = {
  formValues: PropTypes.object.isRequired,
};

export default StepOne;
