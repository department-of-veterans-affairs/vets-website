import React from 'react';

const GettingStartedWithBenefits = () => {
  return (
    <div>
      <div className="vads-u-border--3px vads-u-border-color--gray-lightest vads-u-border-bottom--0">
        <h2 className="getting-started-with-benefits">
          Getting started with benefits
        </h2>
      </div>
      <div className="vads-u-border--3px vads-u-padding-x--4 vads-u-border-color--gray-lightest">
        <div className="vads-u-margin-y--2p5">
          <h3>How do I prepare before starting my application?</h3>
          <hr className="vads-u-margin-top--neg0p25" />
          <ul className="getting-started-with-benefits-li">
            <li>Find out if you're eligible for VA education benefits</li>
            <li>
              Gather the documents and information listed below that you'll need
              to apply for education benefits
            </li>
          </ul>
          <p>
            <b>Note:</b> To apply for Veteran Readiness and Employment (Chapter
            31) or educational and career counseling through Personalized Career
            Planning and Guidance (Chapter 36), you'll need to use a different
            application.
          </p>
          <p>
            <a href="/careers-employment/vocational-rehabilitation/how-to-apply/">
              Find out how to apply for Veteran Readiness and Employment
              (Chapter 31)
            </a>{' '}
            <a href="/careers-employment/education-and-career-counseling/">
              Find out how to apply for educational and career counseling
              (Chapter 36)
            </a>
          </p>
          <h3>What documents and information do I need to apply?</h3>
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
          <h3>A decision with consequences</h3>
          <hr className="vads-u-margin-top--neg0p25" />
          <p>
            Your decision to apply for a certain educational benefit could
            impact your eligibility for other benefits. Here are a few factors
            to keep in mind:
          </p>
          <ul className="getting-started-with-benefits-li">
            <li>
              If you're eligible for more than one education benefit, such as
              the Post-9/11 GI Bill and the Montgomery GI Bill, you must choose
              which benefit to receive,{' '}
              <b>a decision that's final and cannot be changed.</b>
            </li>
            <li>
              If you're eligible for the Post-9/11 GI Bill and two or more
              additional education benefits, you must give up one of the
              additional education benefits. However, you may remain eligible
              for the benefit or benefits you did not give up.
            </li>
          </ul>{' '}
          <div>
            <i
              className="vads-u-margin-top--1p5 fa fa-chevron-circle-right 30px vads-u-font-size--xl vads-u-color--link-default"
              aria-hidden="true"
            />{' '}
            <div className="vads-u-display--inline vads-u-padding-bottom--4 test">
              {/* RENAMED REMOVE NOW */}
              <div className="test">
                <b>
                  <a href="/education/how-to-apply/">
                    Apply for education benefits
                  </a>
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedWithBenefits;
