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
  render() {
    return (
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
        {// PROD FLAG CT 116 STORY 19868
        environment.isProduction() ? (
          <p>
            After you’ve been approved for VET TEC, apply to the program you’d
            like to attend.
          </p>
        ) : (
          <p>
            Then, after you've been approved for VET TEC, apply to the
            VA-approved training provider you'd like to attend.
          </p>
        )}
        {// PROD FLAG CT 116 STORY 19868
        environment.isProduction() ? (
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
        ) : (
          this.providersWebsiteLink()
        )}
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
  }
}
export default VetTecApplicationProcess;
