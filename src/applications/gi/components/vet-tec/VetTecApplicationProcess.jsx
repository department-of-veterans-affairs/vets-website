import React from 'react';
import environment from 'platform/utilities/environment';

class VetTecApplicationProcess extends React.Component {
  providersWebsiteLink = () => {
    const programs = this.props.institution.programs;

    if (
      programs[0].providerWebsite === null ||
      programs[0].providerWebsite === ''
    ) {
      return (
        <p>
          To learn more about available programs, visit the training provider's
          website.
        </p>
      );
    }
    return (
      <p>
        To learn more about available programs,{' '}
        <a
          href={`https://${programs[0].providerWebsite}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          visit the training provider's website
        </a>
        .
      </p>
    );
  };

  renderProduction = () => (
    <div
      className={
        'columns vads-u-margin-top--neg1p5 vads-u-margin-x--neg1p5 medium-screen:vads-l-col--10'
      }
    >
      <h3 className="vads-u-font-size--h4">
        Enrolling in VET TEC is a two-step process:
      </h3>
      <p>
        First, you’ll need to apply for Veteran Employment Through Technology
        Education Courses (VET TEC). You’ll get a Certificate of Eligibility
        (COE) in the mail if we approve your application.
      </p>
      <p>
        <a
          href={
            '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994/introduction'
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply for VET TEC (VA Form 22-0994)
        </a>
      </p>
      <p>
        After you’ve been approved for VET TEC, apply to the program you’d like
        to attend.
      </p>
      <p>
        <a
          href={
            '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/'
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about VET TEC programs
        </a>
      </p>
      <h3 className="vads-u-font-size--h4">
        Have questions about the VET TEC program or how to apply?
      </h3>
      <div>
        <ul className="vet-tec-application-process-list">
          <li>
            Call us at 1-888-GIBILL (
            <a href="tel:+18884424551">1-888-442-4551</a>
            ). We’re here Monday through Friday, 8:00a.m. to 7:00 p.m. ET. If
            you have hearing loss, call TYY:711.
          </li>
          <li>
            Or email us at{' '}
            <a href="mailto:VETTEC.VBABUF@va.gov">VETTEC.VBABUF@va.gov</a>
          </li>
        </ul>
      </div>
    </div>
  );

  renderApplyTo = () => (
    <div>
      <b>To apply for the VET TEC program, you'll need to:</b>
      <ol>
        <li>
          Fill out an Application for Veteran Employment Through Technology
          Education Courses (VA Form 22-0994). If we approve your application,
          you’ll get a Certificate of Eligibility (COE) in the mail.
          <p>
            <a
              href={
                'https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994'
              }
            >
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
  );

  renderQuestions = () => (
    <div>
      <b>What if I have questions about the VET TEC program?</b>
      <div>
        <ul className="vet-tec-application-process-list">
          <li>
            Call us at 888-GIBILL-1 (<a href="tel:+18884424551">888-442-4551</a>
            ). We’re here Monday through Friday, 8:00a.m. to 7:00 p.m. ET. If
            you have hearing loss, call TYY:711, <b>or</b>
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
    // PROD FLAG CT 116 STORY 19920
    return environment.isProduction() ? (
      this.renderProduction()
    ) : (
      <div
        className={
          'columns vads-u-margin-top--neg1p5 vads-u-margin-x--neg1p5 medium-screen:vads-l-col--10'
        }
      >
        <h3 className="vads-u-font-size--h3 vads-u-margin-top--1p5 vads-u-margin-bottom--1p5">
          How do I apply for VET TEC?
        </h3>
        {this.renderApplyTo()}
        {this.renderQuestions()}
      </div>
    );
  }
}

export default VetTecApplicationProcess;
