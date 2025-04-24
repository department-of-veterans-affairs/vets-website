import React from 'react';
import { useSelector } from 'react-redux';
import { MARRIAGE_TYPES } from '../config/constants';

export const SpouseAdditionalEvidence = () => {
  const formData = useSelector(state => {
    return state?.form?.data || {};
  });
  const isCommonLawMarriage =
    formData.currentMarriageInformation?.typeOfMarriage ===
    MARRIAGE_TYPES.commonLaw;
  const isTribalMarriage =
    formData.currentMarriageInformation?.typeOfMarriage ===
    MARRIAGE_TYPES.tribal;
  const isProxyMarriage =
    formData.currentMarriageInformation?.typeOfMarriage ===
    MARRIAGE_TYPES.proxy;

  const { veteranAddress } = formData.veteranContactInformation || {};
  const isOutsideUSA =
    veteranAddress?.country !== 'USA' || Boolean(veteranAddress?.isMilitary);

  return (
    <div>
      <p>
        Based on your answers, you’ll need to submit supporting evidence to add
        your spouse as your dependent.
      </p>
      <p>
        You can upload your files online now, or send us your documents later.
        If you want to send us your documents later, we’ll provide instructions
        at the end of this form.
      </p>
      <va-accordion>
        <va-accordion-item
          id="supporting-evidence"
          header="Supporting evidence you need to submit"
          level="3"
        >
          <ul>
            {isOutsideUSA && (
              <li>
                A copy of your marriage license, or a church record of your
                marriage
                {(isTribalMarriage || isProxyMarriage) && (
                  <>
                    , <strong>and</strong>
                  </>
                )}
              </li>
            )}

            {isCommonLawMarriage && (
              <>
                <li>
                  Copies of the birth certificates for you and your spouse’s
                  children, <strong>and</strong>
                </li>
                <li>
                  2 Statements of Marital Relationship (VA Form 21-4170) – 1
                  that you complete and 1 that your spouse completes,{' '}
                  <strong>and</strong>
                  <br />
                  <a
                    href="/find-forms/about-form-21-4170"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Download VA Form 21-4170 (opens in new tab)
                  </a>
                </li>
                <li>
                  2 Supporting Statements Regarding Marriage (VA Form 21-4171)
                  completed by two different people with knowledge about your
                  marriage
                  <br />
                  <a
                    href="/find-forms/about-form-21p-4171"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Download VA Form 21-4171 (opens in new tab)
                  </a>
                </li>
              </>
            )}
            {isTribalMarriage && (
              <>
                <li>
                  Signed statements from you and your spouse. They must include
                  the name of the tribe, date (month, day, and year) of
                  marriage, place (city and state, county and state, or city and
                  country) where the marriage ceremony occurred, and the name
                  and mailing address of the person who performed the ceremony,{' '}
                  <strong>and</strong>
                </li>
                <li>
                  Signed statements from at least two people who were present at
                  the tribal marriage ceremony. They must include the name of
                  the tribe, date (month, day, and year) of marriage, place
                  (city and state, county and state, or city and country) where
                  the ceremony happened, and the name and mailing address of the
                  person who performed the ceremony, <strong>and</strong>
                </li>
                <li>
                  A signed statement from the person who performed the ceremony.
                  This must include the date (month, day, and year) and place
                  (city and state, county and state, or city and country) where
                  the marriage ceremony happened, and the person’s authority for
                  conducting the ceremony
                </li>
              </>
            )}
            {isProxyMarriage && (
              <li>
                Copies of all documents and certificates issued in connection
                with your proxy marriage.
              </li>
            )}
          </ul>
        </va-accordion-item>
      </va-accordion>
      <h3>Submit your files online</h3>
      <p>You can upload your files now.</p>
      <va-additional-info trigger="Document upload instructions" disable-border>
        <div>
          <ul>
            <li>File types you can upload: JPEG, JPG, PNG or PDF</li>
            <li>
              You can upload multiple files, but they have to add up to 10 MB or
              less.
            </li>
          </ul>
        </div>
      </va-additional-info>
    </div>
  );
};
