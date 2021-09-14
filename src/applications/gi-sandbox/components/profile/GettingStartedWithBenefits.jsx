import React from 'react';

const GettingStartedWithBenefits = () => {
  return (
    <div>
      <div className="vads-u-margin-top--neg1p5 vads-u-padding-left--2p5 small-screen-font">
        <div className="vads-u-margin-y--2p5">
          <h3 className="small-screen-font">
            How do I prepare before starting my application?
          </h3>
          <hr className="vads-u-margin-top--neg0p25" />
          <ul className="getting-started-with-benefits-li">
            <li>
              <a
                href="/education/eligibility/"
                rel="noopener noreferrer"
                id="find-out-if-youre-eligible"
              >
                Find out if you’re eligible for VA education benefits
              </a>
            </li>
            <li>
              Gather the documents and information listed below that you’ll need
              to apply for education benefits
            </li>
          </ul>
          <div className="vads-u-margin-right--9">
            <p>
              <b>Note:</b> To apply for Veteran Readiness and Employment
              (Chapter 31) or educational and career counseling through
              Personalized Career Planning and Guidance (Chapter 36), you’ll
              need to use a different application.
            </p>
          </div>
          <p>
            <a
              href="/careers-employment/vocational-rehabilitation/how-to-apply/"
              rel="noopener noreferrer"
              id="how-to-apply-for-chapter-31"
            >
              Find out how to apply for Veteran Readiness and Employment
              (Chapter 31)
            </a>{' '}
          </p>
          <p>
            <a
              href="/careers-employment/education-and-career-counseling/"
              rel="noopener noreferrer"
              id="how-to-apply-for-chapter-36"
            >
              Find out how to apply for educational and career counseling
              (Chapter 36)
            </a>
          </p>
          <h3 className="small-screen-font">
            What documents and information do I need to apply?
          </h3>
          <hr className="vads-u-margin-top--neg0p25" />
          <ul className="getting-started-with-benefits-li">
            <li>Social Security number</li>
            <li>Bank account direct deposit information</li>
            <li>Education and military history</li>
            <li>
              Basic information about the school or training facility you want
              to attend or are attending now
            </li>
          </ul>
          <h3 className="small-screen-font">A decision with consequences</h3>
          <hr className="vads-u-margin-top--neg0p25" />
          <p className="vads-u-margin-right--9">
            Your decision to apply for a certain educational benefit could
            impact your eligibility for other benefits. Here are a few factors
            to keep in mind:
          </p>
          <ul className="getting-started-with-benefits-li">
            <li className="vads-u-margin-right--9">
              If you’re eligible for more than one education benefit, such as
              the Post-9/11 GI Bill and the Montgomery GI Bill, you must choose
              which benefit to receive,{' '}
              <b>a decision that’s final and cannot be changed.</b>
            </li>
            <li className="vads-u-margin-right--9">
              If you’re eligible for the Post-9/11 GI Bill and two or more
              additional education benefits, you must give up one of the
              additional education benefits. However, you may remain eligible
              for the benefit or benefits you did not give up.
            </li>
          </ul>{' '}
          <div>
            <b>
              <a
                href="/education/how-to-apply/"
                rel="noopener noreferrer"
                className="vads-c-action-link--blue"
                id="apply-for-edu-benefits"
              >
                Apply for education benefits
              </a>
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedWithBenefits;
