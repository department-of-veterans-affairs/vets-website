import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Apply for accrued benefits online',
  formSubTitle: '',
  authStartFormText: 'Apply for accrued benefits',
  displayNonVeteranMessaging: true,
};

const ombInfo = {
  resBurden: '30',
  ombNumber: '2900-0016',
  expDate: '8/31/2025',
};

const childContent = (
  <>
    <p>
      Primarily for executors or administrators of VA beneficiaries' estates (VA
      Form 21P-601)
    </p>
    <p>
      Use this form, in some cases, to apply for unpaid benefits that we owed to
      a VA beneficiary when they died. Be sure to read all the information on
      this page first to make sure this is the right form for you.
    </p>
    <h2>What to know before you fill out this application</h2>
    <h3>Who should use this form</h3>
    <ul className="vads-u-margin-bottom--4">
      <li>
        <strong>
          If you’re the executor or administrator of the beneficiary’s estate,{' '}
        </strong>
        this is the right form for you.
      </li>
      <li>
        <strong>
          If you’re the surviving spouse, dependent child, or parent of a
          deceased Veteran,
        </strong>{' '}
        this isn’t the best form for you to use. Instead, use the application
        that allows you to apply for survivor benefits like VA Dependency and
        Indemnity Compensation (VA DIC), Survivors Pension, and Accrued Benefits
        at the same time.
        <br />
        <va-link
          href="/family-member-benefits/apply-for-dependent-compensation-form-21p-534ez/"
          text="Learn about VA DIC and how to apply for survivor benefits"
        />
      </li>
      <li>
        <strong>
          If you already submitted VA Form 21P-534EZ or VA Form 21P-535 to apply
          for survivor benefits,
        </strong>{' '}
        don’t submit this form. You can check the status of your current claim
        instead.
        <br />
        <br />
        <va-link href="/track-claims/" text="Check the status of your claim" />
      </li>
      <li>
        <strong>
          If none of these descriptions fit you, but you paid for the
          beneficiary’s burial or care during their final illness,
        </strong>{' '}
        you’ll need to use the PDF version of this form. You’ll apply as an
        unpaid creditor.
        <br />
        <br />
        <va-link
          href="https://www.vba.va.gov/pubs/forms/VBA-21P-601-ARE.pdf"
          text="Get VA Form 21P-601 to download"
        />
      </li>
      <li>
        <strong>If multiple people are applying,</strong> each person has to
        submit their own form
      </li>
    </ul>
    <h3>Time limits to apply</h3>
    <ul className="vads-u-margin-bottom--4">
      <li>
        You must apply for accrued benefits within <strong>1 year</strong> of
        the beneficiary’s death.
      </li>
      <li>
        If you’re filing a lump sum accrued benefits claim, you must do so
        within <strong>5 years</strong> of the beneficiary’s death.
      </li>
    </ul>
    <h3>What you’ll need to apply</h3>
    <ul className="vads-u-margin-bottom--4">
      <li>The beneficiary’s name, Social Security number, and date of death</li>
      <li>
        The beneficiary’s death certificate (unless they died in a VA facility)
      </li>
      <li>Your personal and contact information</li>
      <li>Information about surviving relatives</li>
      <li>
        Any certified, signed legal documents showing the assignment of the
        executor or administrator of the beneficiary’s estate
      </li>
      <li>
        Bills or other documentation of expenses if you’re claiming
        reimbursement
      </li>
    </ul>
  </>
);

export const IntroductionPage = ({ route }) => {
  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
    />
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
