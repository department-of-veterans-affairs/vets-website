import React from 'react';
import FormFooter from 'platform/forms/components/FormFooter';

const Footer = ({ formConfig, currentLocation }) => (
  <div className="row">
    <p className="usa-width-two-thirds medium-8">
      Respondent Burden: This information is collected in accordance with
      section 3507 of the Paperwork Reduction Act of 1995. Accordingly, we may
      not conduct or sponsor, and you are not required to respond to a
      collection of information unless it displays a valid OMB number. We
      anticipate the time expended by individuals who complete this form will
      average 20 minutes per response, including the time to review
      instructions, search existing data sources, gather the necessary data, and
      complete and review the collection of information. Your response is
      voluntary and not required to obtain or retain benefits to which you may
      be entitled. Send comments concerning the accuracy of this burden
      estimate, including suggestion for reducing this burden or any other
      aspect of this collection of information to the VA Clearance Officer
      (005R1B), 810 Vermont Avenue, NW, Washington, DC 20420. Please DO NOT send
      claims for, or correspondence regarding benefits to this address.
    </p>
    <FormFooter formConfig={formConfig} currentLocation={currentLocation} />
  </div>
);

export default Footer;
