import React from 'react';

// OMB Details
const EXP_DATE = '11/30/2027';
const OMB_NUMBER = '2900-0798';
const RES_BURDEN_MIN = '10';

const TravelPayOMB = () => {
  return (
    <va-omb-info
      exp-date={EXP_DATE}
      omb-number={OMB_NUMBER}
      res-burden={RES_BURDEN_MIN}
      data-testid="travel-pay-omb"
      class="vads-u-margin-y--4"
    >
      <p>
        <strong>VA Burden Statement:</strong> An agency may not conduct or
        sponsor, and a person is not required to respond to, a collection of
        information unless it displays a currently valid OMB control number. The
        OMB control number for this project is {OMB_NUMBER}, and it expires{' '}
        {EXP_DATE}. Public reporting burden for this collection of information
        is estimated to average {RES_BURDEN_MIN} minutes per respondent, per
        year, including the time for reviewing instructions, searching existing
        data sources, gathering and maintaining the data needed, and completing
        and reviewing the collection of information. Send comments regarding
        this burden estimate and any other aspect of this collection of
        information, including suggestions for reducing this burden, to VA
        Reports Clearance Officer at{' '}
        <a
          href="mailto:VACOPaperworkReduAct@va.gov"
          target="_blank"
          rel="noreferrer"
        >
          VACOPaperworkReduAct@va.gov
        </a>
        . Please refer to OMB Control No. {OMB_NUMBER} in any correspondence. Do
        not send your completed BTSSS claim or VA Form 10-3542 to this email
        address.
      </p>

      <p>
        <strong>Privacy Act information:</strong> VA is asking you to provide
        the information on this form under 38 U.S.C. Sections 111 to determine
        your eligibility for Beneficiary Travel benefits and will be used for
        that purpose. Information you supply may be verified through a
        computer-matching program. VA may disclose the information that you put
        on the form as permitted by law; possible disclosures include those
        described in the “routine use” identified in the VA systems of records
        24VA19 Patient Medical Record-VA, published in the Federal Register in
        accordance with the Privacy Act of 1974. Providing the requested
        information is voluntary, but if any or all of the requested information
        is not provided, it may delay or result in denial of your request for
        benefits. Failure to furnish the information will not have any effect on
        any other benefits to which you may be entitled. If you provide VA your
        Social Security Number, VA will use it to administer your VA benefits.
        VA may also use this information to identify Veterans and persons
        claiming or receiving VA benefits and their records, and for other
        purposes authorized or required by law.
      </p>
    </va-omb-info>
  );
};

export default TravelPayOMB;
