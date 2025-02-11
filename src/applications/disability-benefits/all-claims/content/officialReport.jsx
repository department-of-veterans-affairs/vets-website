import React from 'react';

export const officialReportPageTitle = 'Official report';

export const officialReportsDescription = () => {
  return (
    <>
      <p>
        If an official report about your traumatic event exists, it will help
        support your claim.
        <br />
        <br />
        It’s also okay if there’s no report. We understand that traumatic events
        often go unreported. You can skip this question if you don’t feel
        comfortable answering.
      </p>
    </>
  );
};

export const reportTypesQuestion =
  'Do any of these types of official reports exist for the event you described? Select all that may exist.';

export const otherReportTypesQuestion =
  'Other official report type not listed here:';

export const otherReportTypesExamples = (
  <va-additional-info trigger="Examples of ’other’ types of reports">
    <div>
      <ul>
        <li>After Action Report (AAR)</li>
        <li>Incident report</li>
        <li>Formal complaint</li>
        <li>Judge Advocate General (JAG)</li>
        <li>Criminal Investigation Division (CID)</li>
        <li>Naval Criminal Investigative Service (NCIS)</li>
      </ul>
    </div>
  </va-additional-info>
);
