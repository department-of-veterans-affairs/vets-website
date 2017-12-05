import React from 'react';
import { Link } from 'react-router';

class InstructionsPage extends React.Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://standards.usa.gov/assets/js/vendor/uswds.min.js';
    script.id = 'uswds';
    document.getElementsByTagName('head')[0].appendChild(script);
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <h1>Get Instructions for Upgrading Your Discharge</h1>
        <main itemScope itemType="http://schema.org/FAQPage">
          <div className="row">
            <article className="usa-content columns">
              <div className="va-introtext">
                <p>Answer a few questions to get customized steps on how to upgrade your discharge.</p>
              </div>
              <div className="main home signup" role="main">
                <div className="section main-menu">
                  <div className="row">
                    <div className="small-12 columns">
                      <div>
                        <p>
                          Note that the DoD has recognized you have a strong case if you can show your discharge was connected to any of these categories:
                        </p>
                        <ul>
                          <li>Mental health conditions, including post-traumatic stress disorder (PTSD) </li>
                          <li>Traumatic brain injury (TBI)</li>
                          <li>Sexual assault or harassment during military service</li>
                          <li>Sexual orientation (including under the Don't Ask Don't Tell policy)</li>
                        </ul>
                        <p>
                          The information you enter is completely confidential.
                        </p>
                        <p>
                          <Link className="usa-button-primary va-button" to="questions">Get Started »</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="small-12 columns">
                      <div className="usa-accordion">
                        <ul className="usa-unstyled-list">
                          <li itemScope itemType="http://schema.org/Question">
                            <button className="usa-button-unstyled usa-accordion-button" aria-controls="dbq4" itemProp="name">Did you know you may be able to get VA benefits without a discharge upgrade?</button>
                            <div id="dbq4" className="usa-accordion-content" itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                              <div itemProp="text">
                                <div className="va-alert usa-alert usa-alert-warning">
                                  <div className="va-alert-body usa-alert-body">
                                    <div className="usa-alert-text usa-alert-heading">
                                      <p>Even with a less than honorable discharge, you may be able to still access some VA benefits through the <a target="_blank" href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf">Character of Discharge or Character of Service Determination process.</a></p>
                                    </div>
                                  </div>
                                </div>
                                <p>If you have a discharge that is less than honorable, when you apply for VA benefits, it will trigger a review at VA. VA will review your record to determine if your service was "honorable for VA purposes."</p>
                                <p>You should receive a letter from VA letting you that they have begun to review your case. The VA handles these reviews on a case-by-case basis, and so they can take a long time — sometimes over a year. To access VA benefits, it helps to respond to this letter with information supporting your case. For example, if you're asking VA to forgive your past behavior, provide evidence of positive steps you have taken in your life since your time in the service such as "buddy statements" or a certificate showing you've completed an drug rehabilitation program.</p>
                                <p>As with trying to upgrade your discharge, you may consider finding someone to advocate on your behalf (such as a lawyer or VSO) in collecting and submitting this evidence, depending on the complexity of your case.</p>
                                <p>Many veterans with less than honorable discharges pursue both methods: a VA characterization of discharge review, and a DoD discharge upgrade. There is no reason not to pursue both at the same time.</p>
                                <p>If you experienced sexual assault or harassment while in the military or need mental health services related to PTSD or other mental health conditions linked to your service, you may qualify for VA health benefits without a VA characterization of discharge review or a discharge upgrade.
                                </p>
                              </div>
                            </div>
                          </li>
                          <li itemScope itemType="http://schema.org/Question">
                            <button className="usa-button-unstyled usa-accordion-button" aria-controls="dbq1" itemProp="name">What if I already applied for an upgrade or correction and was denied?</button>
                            <div id="dbq1" className="usa-accordion-content" itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                              <div itemProp="text">
                                <p>If you have previously made a discharge upgrade application and were denied, you may have to follow a different process. Note that, unless you have new information to add to your application, re-applying is not likely to change the outcome of your case, unless you fall into one of the special groups that the Department of Defense has issued new guidance for (such as people discharged for reasons related to PTSD, TBI, mental health conditions, sexual orientation, or sexual assault or harassment).</p>
                                <h4>Denied Upgrade After Records Review</h4>
                                <p>If your last application was decided by a Discharge Review Board (DRB) Records Review, you may re-apply to the DRB for a Personal Appearance Review—as long as the details of your application can be handled by DRB. (This means: your discharge was less than 15 years ago; your discharge was not the result of a General Court-Martial; and you do not want to change elements of your paperwork other than discharge status, re-enlistment code, and narrative reason for discharge. If your case cannot be handled by the DRB, you should apply to the Board for Correction of Military Records (BCMR) or the Board for Correction of Naval Records (BCNR) for your branch of service, not matter where you sent your previous application.)</p>
                                <h4>Denied Upgrade After Personal Appearance Review</h4>
                                <p>If your last application was decided by a DRB Personal Appearance Review, you must appeal to the BCMR/BCNR for your branch of service. You generally have 3 years to make this appeal, from the date of your denial by DRB, though the Board can decide to waive that deadline.</p>
                                <h4>PTSD or Other Mental Health Conditions</h4>
                                <p>If you're applying for reasons related to PTSD or other mental health conditions and your last application was before 2014, your application will be effectively considered a new application (although your previous application may be consulted for evidence). This is because in 2014, the Department of Defense (DoD) issued new guidance about carefully considering less-than-honorable discharges related to PTSD or other mental health conditions.</p>
                                <h4>TBI</h4>
                                <p>If you're applying for reasons related to TBI and your last application was before 2014, your application will be effectively considered a new application (although your previous application may be consulted for evidence). This is because in 2014, DoD issued new guidance about carefully considering less-than-honorable discharges related to TBI.</p>
                                <h4>Sexual Orientation</h4>
                                <p>If you're applying for reasons related to sexual orientation and your last application was before 2011, your application will be effectively considered a new application (although your previous application may be consulted for evidence). This is because in 2011, DoD issued new guidance about carefully considering less-than-honorable discharges related to sexual orientation.</p>
                                <h4>Sexual Assault</h4>
                                <p>If you're applying for reasons related to sexual assault in the military and your last application was before 2017, your application will be effectively considered a new application (although your previous application may be consulted for evidence). This is because in 2017, DoD issued new guidance about carefully considering less-than-honorable discharges related to sexual assault in the military.</p>
                              </div>
                            </div>
                          </li>
                          <li itemScope itemType="http://schema.org/Question">
                            <button className="usa-button-unstyled usa-accordion-button" aria-controls="dbq2" itemProp="name">What if I have discharges for more than one period of service?</button>
                            <div id="dbq2" className="usa-accordion-content" itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                              <div itemProp="text">
                                <p>If the Department of Defense (DoD) determined you served honorably in one period of service, you may use that honorable characterization to establish eligibility for VA benefits, even if you later received a less than honorable discharge. You earned your benefits during the period in which you served honorably.</p>
                                <p>The only exception is for service-connected disability compensation. You are only eligible to earn disability compensation for disabilities you suffered during a period of honorable service. You can't use an honorable discharge from one period of service to establish eligibility for a service-connected disability from a different period.</p>
                              </div>
                            </div>
                          </li>
                          <li itemScope itemType="http://schema.org/Question">
                            <button className="usa-button-unstyled usa-accordion-button" aria-controls="dbq3" itemProp="name">What if I served honorably, but didn't receive discharge paperwork?</button>
                            <div id="dbq3" className="usa-accordion-content" itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                              <div itemProp="text">
                                <p>If the Department of Defense (DoD) determined you served honorably in one period of service, you may use that honorable characterization to establish eligibility for VA benefits. You earned your benefits during the period in which you served honorably.</p>
                                <p>The only exception is for service-connected disability compensation. You're only eligible to earn disability compensation for disabilities you suffered during a period of honorable service. You can't use an honorable discharge from one period of service to establish eligibility for a service-connected disability from a different period.</p>
                                <p>You may be eligible for VA benefits even if you didn't receive an actual discharge (in the form of a DD-214) at the end of the honorable period. If you completed your original contract period without any disciplinary problems, you can use this period of service to establish your eligibility, even if you re-enlisted or extended your service and did not receive an "honorable" DD-214 at the end of your service. Your eligibility determination for VA benefits based on your honorable service period may not happen automatically. If you believe you completed period of honorable service, but which is not reflected on a DD-214, you will likely need to ask the VA to do a Character of Service Determination.</p>
                                <p>You can also apply to DoD to be issued a second DD-214 only for that honorable period of service. Select "Get Started" above and answer the questions based on your most recent discharge. When you're asked if you completed a period of service in which your character of service was Honorable or General Under Honorable Conditions, select the answer "Yes, I completed a prior period of service, but I did not receive discharge paperwork from that period.</p>
                              </div>
                            </div>
                          </li>
                          <li itemScope itemType="http://schema.org/Question">
                            <button className="usa-button-unstyled usa-accordion-button" aria-controls="dbq5" itemProp="name">What if I have a DD-215 showing an upgraded discharge, but my DD-214 is still incorrect?</button>
                            <div id="dbq5" className="usa-accordion-content" itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                              <div itemProp="text">
                                <p>Historically, when DoD upgraded a Veteran’s discharge, DoD issued a DD-215 showing corrections to the DD-214, and then attached the DD-215 to the old DD-214—meaning the DD-214 itself still shows the outdated discharge and related information. While the discharge on your DD-215 is your correct discharge, some Veterans still want a corrected DD-214 that shows no record of their earlier discharge status.</p>
                                <p>If you have a DD-215 and want an updated DD-214, choose the "Get Started" button above and on the next page select, "I received a discharge upgrade or correction, but my upgrade came in the form of a DD-215 and I want an updated DD-214."</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>
    );
  }
}

export default InstructionsPage;
