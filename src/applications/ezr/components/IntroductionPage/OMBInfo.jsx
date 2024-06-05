import React from 'react';

const OMBInfo = () => {
  const expDate = '06/30/2024';
  const ombNum = '2900-0091';
  const resBurden = '27';
  return (
    <va-omb-info exp-date={expDate} omb-number={ombNum} res-burden={resBurden}>
      <p>
        <strong>Public Burden Statement:</strong> An agency may not conduct or
        sponsor, and a person is not required to respond to, a collection of
        information unless it displays a currently valid OMB control number. The
        OMB control number for this project is {ombNum}, and it expires{' '}
        {expDate}. Public reporting burden for this collection of information is
        estimated to average {resBurden} minutes per respondent, per year,
        including the time for reviewing instructions, searching existing data
        sources, gathering and maintaining the data needed, and completing and
        reviewing the collection of information. Send comments regarding this
        burden estimate and any other aspect of this collection of information,
        including suggestions for reducing this burden, to VA Reports Clearance
        Officer at{' '}
        <a
          href="mailto:VACOPaperworkReduAct@va.gov"
          target="_blank"
          rel="noreferrer"
        >
          VACOPaperworkReduAct@va.gov
        </a>
        . Please refer to OMB Control No. {ombNum} in any correspondence. Do not
        send your completed VA Form 10-10EZ to this email address.
      </p>

      <p>
        <strong>Privacy Act information:</strong> VA is asking you to provide
        the information on this form under 38 U.S.C. Sections 1705,1710, 1712,
        and 1722 in order for VA to determine your eligibility for medical
        benefits. Information you supply may be verified from initial submission
        forward through a computer-matching program. VA may disclose the
        information that you put on the form as permitted by law. VA may make a
        “routine use” disclosure of the information as outlined in the Privacy
        Act systems of records notices and in accordance with the VHA Notice of
        Privacy Practices. Providing the requested information is voluntary, but
        if any or all of the requested information is not provided, it may delay
        or result in denial of your request for health care benefits. Failure to
        furnish the information will not have any effect on any other benefits
        to which you may be entitled. If you provide VA your Social Security
        Number, VA will use it to administer your VA benefits. VA may also use
        this information to identify Veterans and persons claiming or receiving
        VA benefits and their records, and for other purposes authorized or
        required by law.
      </p>
    </va-omb-info>
  );
};

export default OMBInfo;
