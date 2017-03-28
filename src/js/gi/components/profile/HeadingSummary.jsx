import React from 'react';
import _ from 'lodash';
import AlertBox from '../../../common/components/AlertBox';

class HeadingSummary extends React.Component {

  render() {
    const it = this.props.institution;

    const schoolSize = (enrollment) => {
      if (!enrollment) return 'Unknown';
      if (enrollment <= 2000) {
        return 'Small';
      } else if (enrollment <= 15000) {
        return 'Medium';
      }
      return 'Large';
    };

    const IconWithInfo = ({ icon, children, present }) => {
      if (!present) return null;
      return <span><i className={`fa fa-${icon}`}/>&nbsp;{children}</span>;
    };

    return (
      <div className="heading row">
        <div className="small-12 column">
          <h1>{it.name}</h1>
          <AlertBox
              content={(<a href="#viewWarnings" onClick={this.props.onViewWarnings}>View cautionary information about this school</a>)}
              isVisible={!!it.cautionFlag}
              status="warning"/>
          <p style={{ marginBottom: '1.5em' }}>
            <strong>{it.studentCount}</strong> GI Bill students
            (<a onClick={this.props.onLearnMore}>Learn more</a>)
          </p>
          <div className="small-12 medium-4 column">
            <p>
              <IconWithInfo icon="map-marker" present={it.city && it.country}>
                {it.city}, {it.country === 'usa' ? it.state : it.country}
              </IconWithInfo>
            </p>
            <p style={{ display: 'block' }}>
              <IconWithInfo icon="globe" present={it.website}>
                <a href={it.website} target="_blank">{it.website}</a>
              </IconWithInfo>
            </p>
            <p>
              <IconWithInfo icon="calendar-o" present={it.type !== 'ojt' && (it.highestDegree === 2 || it.highestDegree === 4)}>
                {it.highestDegree} year program
              </IconWithInfo>
            </p>
          </div>
          <div className="small-12 medium-4 column">
            <p>
              <IconWithInfo icon="briefcase" present={it.type === 'ojt'}>
                On-the-job training
              </IconWithInfo>
            </p>
            <p>
              <IconWithInfo icon="institution" present={it.type && it.type !== 'ojt'}>
                {_.capitalize(it.type)} institution
              </IconWithInfo>
            </p>
            <p>
              <IconWithInfo icon="map" present={it.localeType && it.type && it.type !== 'ojt'}>
                {_.capitalize(it.localeType)} locale
              </IconWithInfo>
            </p>
            <p>
              <IconWithInfo icon="group" present={it.undergradEnrollment && it.type && it.type !== 'ojt'}>
                {schoolSize(it.undergradEnrollment)} size
              </IconWithInfo>
            </p>
          </div>
          <div className="small-12 medium-4 column"></div>
        </div>
      </div>
    );
  }

}

HeadingSummary.propTypes = {
  institution: React.PropTypes.object,
  onLearnMore: React.PropTypes.func,
  onViewWarnings: React.PropTypes.func
};

export default HeadingSummary;
