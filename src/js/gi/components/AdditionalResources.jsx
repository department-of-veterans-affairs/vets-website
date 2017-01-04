import React from 'react';

class AdditionalResources extends React.Component {

  render() {
    return (
      <div>
        <div className="row">
          <div className="usa-card usa-card-fill add-resources small-12 columns">
            <div className="usa-card-header">
              Additional Resources
            </div>
            <div className="usa-card-content">
              <ul>
                <li className="horz-timeline-text">
                  <a id="timeline-explore-career" href="http://www.benefits.va.gov/gibill/careerscope.asp" className="noback" target="_blank"><div className="fa-additional-resources">1</div>Explore Your Career</a>
                </li>
                <li className="horz-timeline-text">
                  <div className="fa-additional-resources fa-current-location">2</div>GI Bill Comparison Tool
                </li>
                <li className="horz-timeline-text">
                  <a id="timeline-choose-a-school" href="http://www.benefits.va.gov/gibill/choosing_a_school.asp" className="noback" target="_blank"><div className="fa-additional-resources">3</div>Choose a School</a>
                </li>
                <li className="horz-timeline-text">
                  <a id="timeline-apply-for-GI-Bill" href="https://www.ebenefits.va.gov/ebenefits-portal/ebenefits.portal?_nfpb=true&_nfxr=false&_pageLabel=Vonapp" className="noback" target="_blank"><div className="fa-additional-resources">4</div>Apply for GI Bill</a>
                </li>
                <li className="horz-timeline-text">
                  <a id="timeline-succeed-in-school" href="http://www.benefits.va.gov/vocrehab/edu_voc_counseling.asp" className="noback" target="_blank"><div className="fa-additional-resources">5</div>Succeed in School</a>
                </li>
                <li className="horz-timeline-text">
                  <a id="timeline-find-employment-vec"href="https://www.vets.gov/veterans-employment-center/" className="noback" target="_blank"><div className="fa-additional-resources">6</div>Find Employment</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="whats-your-plan small-12 columns">
            <div className="usa-card usa-card-fill">
              <div className="usa-card-header">
                What's Your Plan?
              </div>
              <div className="usa-card-content">
                <p>
                  Transitioning to civilian life takes preparation, research, planning, and the right tools.
                  We're here to help you make the right decisions on where to use your hard earned benefits!
                </p>
                <iframe width="100%" src="https://www.youtube.com/embed/Z1ttkv9oRI4" title="Know Before You Go" frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default AdditionalResources;
