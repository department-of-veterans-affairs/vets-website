import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const ProfileSection = ({
  title,
  content,
  additionalInfoTrigger,
  additionalInfoContent,
}) => (
  <div className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border--1px">
    <h2 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--bold vads-u-line-height--4 vads-u-margin--0 vads-u-width--auto">
      {title}
    </h2>
    {additionalInfoTrigger && (
      <span className="vads-u-color--gray-medium vads-u-display--block vads-u-font-weight--normal vads-u-margin--0 vads-u-width--full vads-u-margin-bottom--1">
        <va-additional-info
          trigger={additionalInfoTrigger}
          uswds="true"
          className="hydrated"
        >
          <div>{additionalInfoContent}</div>
        </va-additional-info>
      </span>
    )}
    <div className="vads-u-margin--0 vads-u-width--full">{content}</div>
  </div>
);

const PersonalInformationPage = () => {
  const { userData } = useAuth();

  return (
    <div>
      <div className="vads-l-row">
        <Sidebar />
        <div className="vads-l-col--12 vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--6 small-desktop-screen:vads-l-col--8">
          <h1
            tabIndex="-1"
            className="vads-u-font-size--h2 vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
            data-focus-target="true"
          >
            Personal information
          </h1>
          <div className="vads-u-margin-bottom--6">
            <div className="vads-u-margin-bottom--3">
              <va-additional-info
                trigger="How to fix an error in your name or date of birth"
                uswds="true"
                className="hydrated"
              >
                <div>
                  <p className="vads-u-margin-top--0">
                    If our records have a misspelling or other error in your
                    name or date of birth, you can request a correction. We’ll
                    ask for a current photo ID that shows proof of the correct
                    information.
                  </p>
                  <p>Here’s how to request a correction:</p>
                  <p>
                    <span className="vads-u-font-weight--bold vads-u-display--block">
                      If you’re enrolled in the VA health care program
                    </span>
                    Contact your VA medical center.
                  </p>
                  <span
                    className="hydrated"
                    style={{
                      color: 'blue',
                      textDecoration: 'underline',
                      cursor: 'default',
                    }}
                  >
                    Find your VA medical center
                  </span>
                  <p className="vads-u-margin-bottom--0 vads-u-padding-right--0 mobile-lg:vads-u-padding-right--6">
                    <span className="vads-u-font-weight--bold vads-u-display--block">
                      If you receive VA benefits, but aren’t enrolled in VA
                      health care
                    </span>
                  </p>
                </div>
              </va-additional-info>
            </div>

            <section className="profile-info-card">
              <ProfileSection
                title="Legal name"
                content={
                  <p
                    className="vads-u-margin--0 vads-u-width--full"
                    data-testid="legalNameField"
                  >
                    {userData?.user?.name || 'N/A'}
                  </p>
                }
                additionalInfoTrigger="How to update your legal name"
                additionalInfoContent={
                  <p className="vads-u-margin-top--0 vads-u-color--black">
                    If you’ve changed your legal name, you’ll need to tell us so
                    we can change your name in our records.
                    <span
                      style={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'default',
                      }}
                      className="hydrated"
                    >
                      Learn how to change your legal name on file with VA
                    </span>
                  </p>
                }
              />
              <ProfileSection
                title="Date of birth"
                content={<p>{userData?.user?.birthDate || 'N/A'}</p>}
              />
              <ProfileSection
                title="Preferred name"
                content={
                  <div
                    className="vet360-profile-field"
                    data-field-name="preferredName"
                    data-testid="preferredName"
                  >
                    <div className="vet360-profile-field-content">
                      {userData?.user?.preferredName ||
                        'Choose edit to add a preferred name.'}
                      <button
                        aria-label="Edit Preferred name"
                        type="button"
                        data-action="edit"
                        id="edit-preferred-name"
                        className="vads-u-margin-top--1p5"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                }
              />
              <ProfileSection
                title="Gender identity"
                content={
                  <div
                    className="vet360-profile-field"
                    data-field-name="genderIdentity"
                    data-testid="genderIdentity"
                  >
                    {userData?.user?.gender ||
                      'Choose edit to add a gender identity.'}
                    <button
                      aria-label="Edit Gender identity"
                      type="button"
                      data-action="edit"
                      id="edit-gender-identity"
                      className="vads-u-margin-top--1p5"
                    >
                      Edit
                    </button>
                  </div>
                }
                additionalInfoTrigger="What to know before you decide to share your gender identity"
                additionalInfoContent={
                  <p className="vads-u-color--black">
                    It’s your choice whether or not to share your gender
                    identity in your VA.gov profile. Here’s what to know before
                    you share:
                    <ul className="vads-u-padding-left--3 list-type-disc">
                      <li>
                        If you get health care at VA, knowing your gender
                        identity can help your care team better assess your
                        health needs.
                      </li>
                      <li>
                        Any information you share in your profile goes into VA
                        records that non-health care staff may also access.
                      </li>
                      <li>
                        If you only want to share your gender identity in your
                        health records, don’t add this information to your
                        VA.gov profile.
                      </li>
                    </ul>
                  </p>
                }
              />
              <ProfileSection
                title="Disability rating"
                content={
                  <>
                    <p data-testid="disabilityRatingField">
                      {userData?.disabilityRating?.rating ||
                        'Our records show that you don’t have a disability rating.'}
                    </p>
                    <span
                      className="hydrated"
                      style={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'default',
                      }}
                    >
                      Learn more about VA disability ratings
                    </span>
                    <span
                      className="hydrated"
                      style={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'default',
                      }}
                    >
                      PACT Act: Eligibility updates based on toxic exposure
                    </span>
                  </>
                }
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationPage;
