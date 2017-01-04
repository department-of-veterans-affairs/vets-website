import React from 'react';

class AboutYourselfTeaser extends React.Component {
  render() {
    return (
      <div className="medium-6 columns teaser-pad teaser-container">
        <p>
          Whether you want to apply your GI Bill benefits to college
          classes or an on-the-job training program, this tool will
          help you make the most of them.
        </p>
        <div className="medium-4 columns box">
          <div className="icon">
            <i className="fa fa-graduation-cap fa-teaser"></i>
          </div>
          <span className="teaser-figure"><b>$</b></span>
          <span className="teaser-head"><p>Tuition &amp; Fees</p></span>
        </div>
        <div className="medium-4 columns box">
          <div className="icon">
            <i className="fa fa-home fa-teaser"></i>
          </div>
          <span className="teaser-figure"><b>$</b></span>
          <span className="teaser-head"><p>Housing</p></span>
        </div>
        <div className="medium-4 columns box">
          <div className="icon">
            <i className="fa fa-book fa-teaser"></i>
          </div>
          <span className="teaser-figure"><b>$</b></span>
          <span className="teaser-head"><p>Books</p></span>
        </div>
      </div>
    );
  }
}

export default AboutYourselfTeaser;
