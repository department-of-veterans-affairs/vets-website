import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleLoginModal as toggleLoginModalPlatform } from 'platform/site-wide/user-nav/actions';

export const AdditionalMarriagesAlert = () => (
  <va-alert-expandable
    status="warning"
    trigger="You'll need to submit VA Form 21-4138"
    disable-border="true"
  >
    <p>
      You’ll need to submit a Statement in Support of Claim (VA Form 21-4138) as
      needed to provide the information for each additional marriage.
    </p>
    <p>
      We’ll ask you to upload these documents at the end of this application. Or
      you can send it to us by mail.
    </p>
    <p>
      <va-link
        href="/find-forms/about-form-21-4138/"
        external
        text="Get VA Form 21-4138 to download"
      />
    </p>
  </va-alert-expandable>
);

const RequestFormAlert = ({
  title,
  formName,
  formLink,
  advisory,
  children,
}) => (
  <va-alert-expandable
    status="warning"
    trigger={`You’ll need to submit ${formName}`}
  >
    <p className="vads-u-margin-y--0">
      You’ll need to submit an {title} ({formName}
      ). {advisory}
    </p>
    <p>{children}</p>
    <p>
      We’ll ask you to upload this document at the end of this application. Or
      you can send it to us by mail.
    </p>
    <p>
      <va-link href={formLink} external text={`Get ${formName} to download`} />
    </p>
  </va-alert-expandable>
);

RequestFormAlert.propTypes = {
  formLink: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  advisory: PropTypes.string,
  children: PropTypes.node,
};

export const RequestNursingHomeInformationAlert = () => (
  <RequestFormAlert
    title="Nursing Home Information in Connection with Claim
    for Aid and Attendance"
    formName="VA Form 21-0779"
    formLink="https://www.va.gov/find-forms/about-form-21-0779/"
  />
);

export const SpecialMonthlyPensionEvidenceAlert = () => (
  <RequestFormAlert
    title="Examination of Housebound Status or Permanent
    Need for Regular Aid and Attendance"
    formName="VA Form 21-2680"
    formLink="https://www.va.gov/find-forms/about-form-21-2680/"
    advisory="A licensed medical professional must complete this form."
  />
);

export const IncomeAssetStatementFormAlert = () => (
  <RequestFormAlert
    title="Income and Asset Statement in Support of Claim for Pension or Parents' Dependency and Indemnity Compensation"
    formName="VA Form 21P-0969"
    formLink="https://www.va.gov/find-forms/about-form-21p-0969/"
  />
);

export const CourtOrderSeparationAlert = () => (
  <va-alert-expandable
    status="warning"
    trigger="You'll need to submit a copy of the court order."
    disable-border="true"
  >
    We’ll ask you to upload this document at the end of this application. Or you
    can send it to us by mail.
  </va-alert-expandable>
);

export const UnauthenticatedWarningAlert = ({
  toggleLoginModal = toggleLoginModalPlatform,
}) => {
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);
  const dispatch = useDispatch();
  const numberOfSteps = 8;
  const showLoginModal = e => {
    e.preventDefault();
    dispatch(toggleLoginModal(true));
  };

  if (isLoggedIn) {
    return null;
  }
  return (
    <va-alert status="warning" uswds slim>
      <p className="vads-u-margin-y--0">
        This application is {numberOfSteps} steps long and it contains several
        substeps per step. We advise you{' '}
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <va-link
          href="#"
          onClick={showLoginModal}
          text="sign in to save your progress"
        />
        .
      </p>
      <p>
        <strong>Note:</strong> You can sign in after you start your application.
        But you’ll lose any information you already filled in.
      </p>
    </va-alert>
  );
};

UnauthenticatedWarningAlert.propTypes = {
  isLoggedIn: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
};

export const handleAlertMaxItems = () => (
  <>
    <ul>
      <li>
        <span className="vads-u-display--block">
          Statement in Support of Claim (VA Form 21-4138)
        </span>
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-4138/"
          external
          text="Get VA Form 21-4138 to download"
        />
      </li>
      <li>
        <span className="vads-u-display--block">
          Application Request to Add and/or Remove Dependents (VA Form 21-686c)
        </span>
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-686c/"
          external
          text="Get VA Form 21-686c to download"
        />
      </li>
    </ul>
    <p>We’ll ask you to upload this form at the end of this application.</p>
  </>
);

export const handleVeteranMaxMarriagesAlert = () => (
  <div>
    <p className="vads-u-margin-top--0">
      You have added the maximum number of allowed Veteran’s previous marriages
      for this application. Additional marriages can be added using one of these
      supporting documents.
    </p>
    {handleAlertMaxItems()}
  </div>
);

export const handleSpouseMaxMarriagesAlert = () => (
  <div>
    <p className="vads-u-margin-top--0">
      You have added the maximum number of allowed previous marriages for this
      application. Additional marriages can be added using one of these
      supporting documents.
    </p>
    {handleAlertMaxItems()}
  </div>
);

export const VaForm214138Alert = () => (
  <va-alert-expandable
    status="warning"
    trigger="You’ll need to submit a VA Form 21-4138"
    disable-border="true"
  >
    <p>
      You’ll need to submit a Statement in Support of Claim (VA Form 21-4138)
      with the name of the person the child is currently living with and the
      full address of where the child resides.
    </p>
    <p>
      We’ll ask you to upload these documents at the end of this application. Or
      you can send them to us by mail.
    </p>
    <p>
      <span className="vads-u-display--block">
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-4138/"
          external
          text="Get VA Form 21-4138 to download"
        >
          Get VA Form 21-4138 to download (opens in new tab)
        </va-link>
      </span>
    </p>
  </va-alert-expandable>
);
