import React from 'react';
import { useSelector } from 'react-redux';
import { MARRIAGE_TYPES } from '../config/constants';

/**
 * Spouse evidence preparation content
 * @returns {React.ReactElement} Spouse evidence prep content
 */
export const SpouseEvidencePreparation = () => {
  const formData = useSelector(state => {
    return state?.form?.data || {};
  });

  const marriageType = formData?.currentMarriageInformation?.typeOfMarriage;
  const isCommonLawMarriage = marriageType === MARRIAGE_TYPES.commonLaw;
  const isTribalMarriage = marriageType === MARRIAGE_TYPES.tribal;
  const isProxyMarriage = marriageType === MARRIAGE_TYPES.proxy;

  const { veteranAddress } = formData.veteranContactInformation || {};
  const isOutsideUSA =
    veteranAddress?.country !== 'USA' || Boolean(veteranAddress?.isMilitary);

  const showEvidenceContent =
    isOutsideUSA ||
    [
      MARRIAGE_TYPES.commonLaw,
      MARRIAGE_TYPES.tribal,
      MARRIAGE_TYPES.proxy,
      MARRIAGE_TYPES.other,
    ].includes(marriageType);

  let content = <></>;
  let subContent = <></>;
  if (isCommonLawMarriage) {
    subContent = (
      <>
        <p>You’ll need to submit copies of all these documents:</p>
        <ul>
          <li>
            Copies of the birth certificates for you and your spouse’s children,{' '}
            <strong>and</strong>
          </li>
          <li>
            2 Statements of Marital Relationship (VA Form 21-4170) – 1 that you
            complete and 1 that your spouse completes, <strong>and</strong>
            <br />
            <va-link
              href="/find-forms/about-form-21-4170"
              external
              text="Download VA Form 21-4170"
            />
          </li>
          <li>
            2 Supporting Statements Regarding Marriage (VA Form 21-4171)
            completed by two different people with knowledge about your marriage
            <br />
            <va-link
              href="/find-forms/about-form-21-4171"
              external
              text="Download VA Form 21-4171"
            />
          </li>
        </ul>
      </>
    );
  }
  if (isProxyMarriage) {
    subContent = (
      <p>
        You’ll need to submit copies of all documents and certificates issued in
        connection with your proxy marriage.
      </p>
    );
  }
  if (isTribalMarriage) {
    subContent = (
      <>
        <p>You’ll need to submit copies of all documents:</p>
        <ul>
          <li>
            Signed statements from you and your spouse. They must include the
            name of the tribe, date (month, day, and year) of marriage, place
            (city and state, county and state, or city and country) where the
            marriage ceremony occurred, and the name and mailing address of the
            person who performed the ceremony, <strong>and</strong>
          </li>
          <li>
            Signed statements from at least two people who were present at the
            tribal marriage ceremony. They must include the name of the tribe,
            date (month, day, and year) of marriage, place (city and state,
            county and state, or city and country) where the ceremony happened,
            and the name and mailing address of the person who performed the
            ceremony, <strong>and</strong>
          </li>
          <li>
            A signed statement from the person who performed the ceremony. This
            must include the date (month, day, and year) and place (city and
            state, county and state, or city and country) where the marriage
            ceremony happened, and the person’s authority for conducting the
            ceremony.
          </li>
        </ul>
      </>
    );
  }
  if (
    isOutsideUSA &&
    [MARRIAGE_TYPES.ceremonial, MARRIAGE_TYPES.civil].includes(marriageType)
  ) {
    subContent = (
      <p>
        You’ll need to submit a copy of your marriage license, or a church
        record of your marriage
      </p>
    );
  }

  if (showEvidenceContent) {
    content = (
      <div aria-live="polite" aria-atomic="true" aria-relevant="additions text">
        <p>
          Based on your answers, you’ll need to submit supporting evidence to
          add your spouse as your dependent.
        </p>
        <p>We’ll ask you to submit these documents at the end of this form.</p>
        {subContent}
      </div>
    );
  }

  return content;
};
