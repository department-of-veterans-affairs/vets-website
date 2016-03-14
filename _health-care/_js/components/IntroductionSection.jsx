import React from 'react';

class IntroductionPanel extends React.Component {
  constructor() {
    super();
    this.onStateChange = this.onStateChange.bind(this);
  }

  onStateChange(subfield, update) {
    this.props.publishStateChange(['introduction', subfield], update);
  }

  render() {
    return (
      <div className="usa-form-width">
        <div className="row">
          <div className="small-12 columns">
            <h3>Apply online for health care with the 1010ez</h3>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <p>
              You are ready to begin applying for health care. Before you continue,
              here is important information related to applying for VA health care benefits.
            </p>
            <h6>Paperwork Reduction Act</h6>
            <p>
              Paperwork Reduction Act of 1995 requires us to notify you that this information collection is in accordance with
              the clearance requirements of Section 3507 of the Paperwork Reduction Act of 1995. We may not conduct or
              sponsor and you are not required to respond to, a collection of information unless it displays a valid OMB number.
              We anticipate that the time expended by all individuals who must complete this Application for Health Benefits will
              average 30 minutes. This includes the time it will take to read instructions, gather the necessary facts and fill out the
              form.
            </p>
            <h6>Privacy Act Information</h6>
            <p>
              VA is asking you to provide the information on this form under 38 U.S.C. Sections 1705, 1710, 1712, and 1722 in
              order for VA to determine your eligibility for medical benefits. Information you supply may be verified from initial
              submission forward through a computer-matching program. VA may disclose the information that you put on the
              form as permitted by law. VA may make a "routine use" disclosure of the information as outlined in the Privacy Act
              systems of records notices and in accordance with the VHA Notice of Privacy Practices. Providing the requested
              information is voluntary, but if any or all of the requested information is not provided, it may delay or result in denial
              of your request for health care benefits. Failure to furnish the information will not have any effect on any other
              benefits to which you may be entitled. If you provide VA your Social Security Number, VA will use it to administer
              your VA benefits. VA may also use this information to identify Veterans and persons claiming or receiving VA
              benefits and their records, and for other purposes authorized or required by law.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default IntroductionPanel;
