import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

class VetTecApplicationProcess extends React.Component {
  providersWebsiteLink = () => {
    const { programs } = this.props.institution;

    if (
      programs[0].providerWebsite === null ||
      programs[0].providerWebsite === ''
    ) {
      return (
        <p>
          To learn more about these approved programs, visit the training
          provider’s website.
        </p>
      );
    }
    return (
      <p>
        To learn more about these approved programs,{' '}
        <a
          href={programs[0].providerWebsite}
          target="_blank"
          rel="noopener noreferrer"
        >
          visit the training provider's website
        </a>
        .
      </p>
    );
  };

  renderApplyTo = () => (
    <div>
      <b>To apply for the VET TEC program, you'll need to:</b>
      <div>
        <ol>
          <li>
            Fill out an Application for Veteran Employment Through Technology
            Education Courses (VA Form 22-0994). If we approve your application,
            you’ll get a Certificate of Eligibility (COE) in the mail.
            <p>
              <a href="https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994">
                Apply for VET TEC (VA Form 22-0994)
              </a>
            </p>
          </li>
          <li>
            After you’ve been approved for VET TEC, you can then apply to the
            VA-approved training program you’d like to attend.
            {this.providersWebsiteLink()}
          </li>
        </ol>
      </div>
    </div>
  );

  renderQuestions = () => (
    <div>
      <b>What if I have questions about the VET TEC program?</b>
      <div>
        <ul>
          <li>
            Call us at 888-GIBILL-1 (<va-telephone contact={CONTACTS.GI_BILL} />
            ). We’re here Monday through Friday, 8:00a.m. to 7:00 p.m. ET. If
            you have hearing loss, call{' '}
            <va-telephone contact={CONTACTS['711']} tty />, <b>or</b>
          </li>
          <li>
            Email us at{' '}
            <a href="mailto:VETTEC.VBABUF@va.gov">VETTEC.VBABUF@va.gov</a>
          </li>
        </ul>
      </div>
    </div>
  );

  render() {
    return (
      <div className="columns vads-u-margin-top--1 vads-u-margin-x--neg1p5 medium-screen:vads-l-col--10 vet-tec-application-process">
        <h3 className="vads-u-font-size--h3 vads-u-margin-top--1p5 vads-u-margin-bottom--1p5">
          How do I apply for VET TEC?
        </h3>
        {this.renderApplyTo()}
        {this.renderQuestions()}
      </div>
    );
  }
}

VetTecApplicationProcess.propTypes = {
  institution: PropTypes.shape({
    programs: PropTypes.arrayOf(
      PropTypes.shape({
        providerWebsite: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default VetTecApplicationProcess;
