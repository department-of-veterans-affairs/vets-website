import React from 'react';

export const SpouseAdditionalEvidence = _args => {
  // console.log(args);
  return (
    <div>
      <p>
        Based on your answers, you’ll need to submit supporting evidence to add
        your spouse as your dependent.
      </p>
      <va-accordion>
        <va-accordion-item
          id="supporting-evidence"
          header="Supporting evidence you need to submit"
        >
          <ul>
            <li>
              A copy of your marriage license, or a church record of your
              marriage, and
            </li>
            <li>
              Copies of the birth certificates for you and your spouse’s
              children, and
              <ul>
                <li>
                  2 Statements of Marital Relationship (VA Form 21-4170) – 1
                  that you complete and 1 that your spouse completes, and
                </li>
                <li>
                  <a href="/find-forms/about-form-21-4170" target="_blank">
                    Get VA Form 21-4170 to download (opens in new tab)
                  </a>
                </li>
                <li>
                  2 Supporting Statements Regarding Marriage (VA Form 21-4171)
                  completed by two different people with knowledge about your
                  marriage
                </li>
                <li>
                  <a href="/find-forms/about-form-21-4171" target="_blank">
                    Get VA Form 21-4171 to download (opens in new tab)
                  </a>
                </li>
              </ul>
            </li>
            <li>
              Signed statements from you and your spouse. They must include the
              name of the tribe, date (month, day, and year) of marriage, place
              (city and state, county and state, or city and country) where the
              marriage ceremony occurred, and the name and mailing address of
              the person who performed the ceremony, and
            </li>
            <li>
              Signed statements from at least two people who were present at the
              tribal marriage ceremony. They must include the name of the tribe,
              date (month, day, and year) of marriage, place (city and state,
              county and state, or city and country) where the ceremony
              happened, and the name and mailing address of the person who
              performed the ceremony, and
            </li>
            <li>
              A signed statement from the person who performed the ceremony.
              This must include the date (month, day, and year) and place (city
              and state, county and state, or city and country) where the
              marriage ceremony happened, and the person’s authority for
              conducting the ceremony
            </li>
            <li>
              Copies of all documents and certificates issued in connection with
              your proxy marriage.
            </li>
          </ul>
        </va-accordion-item>
      </va-accordion>
      <h3>Submit your files online</h3>
      <p>You can upload your files now.</p>
      <va-additional-info
        trigger="Document upload instructions"
        disable-border
        uswds
      >
        <div>
          <ul>
            <li>File types you can upload: JPEG, JPG, PNG or PDF</li>
            <li>
              You can upload multiples files, but they to add up to 10 MB or
              less.
            </li>
          </ul>
        </div>
      </va-additional-info>
    </div>
  );
};
