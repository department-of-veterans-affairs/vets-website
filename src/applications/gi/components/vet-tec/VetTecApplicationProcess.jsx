import React from 'react';
import environment from 'platform/utilities/environment';

// Production flag for 19418
const VetTecApplicationProcessClassname =
  !environment.isProduction() && 'medium-screen:vads-l-col--10';

const VetTecApplicationProcess = () => (
  <div
    className={
      ('columns vads-u-margin-top--neg1p5 vads-u-margin-x--neg1p5',
      VetTecApplicationProcessClassname)
    }
  >
    <h4>Enrolling in VET TEC is a two-step process:</h4>
    <p>
      First, you’ll need to apply for Veteran Employment Through Technology
      Education Courses (VET TEC). You’ll get a Certificate of Eligibility (COE)
      in the mail if we approve your application.
    </p>
    <p>
      <a
        href={
          '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994/introduction'
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Production flag for 19418 */}
        {!environment.isProduction()
          ? 'Apply for VET TEC (VA Form 22-0994)'
          : 'Apply for VET TEC (VA Form 22-1994)'}
      </a>
    </p>
    <p>
      After you’ve been approved for VET TEC, apply to the program you’d like to
      attend.
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
    <h4>Have questions about the VET TEC program or how to apply?</h4>
    <div>
      <ul className="vet-tec-application-process-list">
        <li>
          Call us at 1-888-GIBILL (<a href="tel:+18884424551">1-888-442-4551</a>
          ). We’re here Monday through Friday, 8:00a.m. to 7:00 p.m. ET. If you
          have hearing loss, call TYY:711.
        </li>
        <li>
          Or email us at{' '}
          <a href="mailto:VETTEC.VBABUF@va.gov">VETTEC.VBABUF@va.gov</a>
        </li>
      </ul>
    </div>
  </div>
);

export default VetTecApplicationProcess;
