import React from 'react';

class VideoSidebar extends React.Component {
  render() {
    return (
      <div className="video-sidebar">
        <h4 className="highlight">What's your plan?</h4>
        <p>
          Transitioning to civilian life takes preparation, research, planning, and the right tools.
          We're here to help you make the right decisions on where to use your hard earned benefits!
        </p>
        <iframe width="100%" src="https://www.youtube.com/embed/Z1ttkv9oRI4"
            title="Know Before You Go" frameBorder="0" allowFullScreen></iframe>
        <h5>Ready to apply?</h5>
        <p>
          <a href="http://www.benefits.va.gov/gibill/careerscope.asp" target="_blank">
            Explore your career
          </a>
        </p>
        <p>
          <a href="http://www.benefits.va.gov/gibill/choosing_a_school.asp" target="_blank">
            Choose a school
          </a>
        </p>
        <p>
          <a href="/education/apply/" target="_blank">
            Apply for education benefits
          </a>
        </p>
      </div>
    );
  }
}

export default VideoSidebar;
