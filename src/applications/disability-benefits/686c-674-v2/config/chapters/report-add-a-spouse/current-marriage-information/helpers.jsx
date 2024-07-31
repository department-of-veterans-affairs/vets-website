import React from 'react';
import { useSelector } from 'react-redux';

export const marriageTypeInformation = (
  <div>
    <p>
      Based on your answer, you’ll need to submit additional documents to add
      your spouse as a dependent.
    </p>
    <p>We’ll ask you to submit these documents at the end of this form.</p>
  </div>
);

const baseMessage = (
  <>
    <p>
      Based on your answer, you’ll need to submit additional documents to add
      your spouse as a dependent.
    </p>
    <p>We’ll ask you to submit these documents at the end of this form.</p>
  </>
);

const typeProxy = (
  <>
    <p>
      You’ll need to submit copies of all documents and certificates issued in
      connection with your proxy marriage.
    </p>
  </>
);

const typeCommonLaw = (
  <>
    <p>You’ll need to submit copies of all these documents:</p>
    <ul>
      <li>
        Copies of the birth certificates for you and your spouse’s children,{' '}
        <strong>and</strong>
      </li>
      <li>
        2 Statements of Marital Relationship (VA Form 21-4170)—1 that you
        complete and 1 that your spouse completes.
        <br />
        <va-link
          href="/find-forms/about-form-21-4170/"
          text="Get VA Form 21-4170 to
          download (opens in new tab)"
        />
      </li>
      <li>
        2 Supporting Statements Regarding Marriage (VA Form 21P-4171) completed
        by two different people with knowledge about your marriage.
        <br />
        <va-link
          href="/find-forms/about-form-21p-4171/"
          text="Get VA Form
          21P-4171 to download (opens in new tab)"
        />
      </li>
    </ul>
  </>
);

const typeTribal = (
  <>
    <p>You’ll need to submit copies of all these documents:</p>
    <ul>
      <li>
        Signed statements from you and your spouse. They must include the name
        of the tribe, date (month, day, and year) of marriage, place (city and
        state, county and state, or city and country) where the marriage
        ceremony occurred, and the name and mailing address of the person who
        performed the ceremony, <strong>and</strong>
      </li>
      <li>
        Signed statements from at least two people who were present at the
        tribal marriage ceremony. They must include the name of the tribe, date
        (month, day, and year) of marriage, place (city and state, county and
        state, or city and country) where the ceremony happened, and the name
        and mailing address of the person who performed the ceremony, and
      </li>
      <li>
        A signed statement from the person who performed the ceremony. This must
        include the date (month, day, and year) and place (city and state,
        county and state, or city and country) where the marriage ceremony
        happened, and the person’s authority for conducting the ceremony
      </li>
    </ul>
  </>
);

export const marriageTypeLabels = {
  CIVIL: 'In a civil ceremony with an officiant who signed my marriage license',
  CEREMONIAL:
    'In a religious ceremony with a clergyperson who signed my marriage',
  'COMMON-LAW': 'By common law',
  PROXY: 'By proxy',
  TRIBAL: 'In a tribal ceremony',
  OTHER: 'Some other way',
};

export const marriageTypeArr = [
  'CEREMONIAL',
  'CIVIL',
  'COMMON-LAW',
  'PROXY',
  'TRIBAL',
  'OTHER',
];

export const SupportingEvidenceNeeded = () => {
  const data = useSelector(
    state => state?.form?.data?.currentMarriageInformation?.type,
  );

  const lookup = {
    'COMMON-LAW': typeCommonLaw,
    PROXY: typeProxy,
    TRIBAL: typeTribal,
  };

  return (
    <>
      {baseMessage}
      {Object.keys(lookup)?.includes(data) ? lookup[data] : null}
    </>
  );
};

export default marriageTypeInformation;
