import React from 'react';

const PrimaryOfficialExemptInfo = () => (
  <div className="vads-u-border-color--primary-alt-light vads-u-border--1px vads-u-margin-top--5 info ">
    <h4 className="vads-u-padding-top--0 vads-u-padding-x--3">
      Who is exempt from Section 305 training requirements?
    </h4>
    <p className="vads-u-margin-y--2 vads-u-padding-x--3">
      <ul>
        <li>
          Existing SCOs at a school not currently identified as a "covered
          educational institution."{' '}
          <a
            href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/covered-educational-institutions.asp"
            external
          >
            Get more information about covered institutions.
          </a>
        </li>
        <li>
          Transferring SCOs from the same type of school (IHL, NCD, OJT/APP,
          FLT) who have completed the training requirement within the current
          training year.
        </li>
        <li>New designees at schools offering ONLY high school diplomas</li>
      </ul>
    </p>
  </div>
);

export default PrimaryOfficialExemptInfo;
