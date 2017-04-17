import React from 'react';
import _ from 'lodash';

import AlertBox from '../../../common/components/AlertBox';
import { formatNumber } from '../../utils/helpers';

const IconWithInfo = ({ icon, children, present }) => {
  if (!present) return null;
  return <span><i className={`fa fa-${icon}`}/>&nbsp;{children}</span>;
};

class HeadingSummary extends React.Component {

  render() {
    const it = this.props.institution;
    it.type = it.type && it.type.toLowerCase();

    const schoolSize = (enrollment) => {
      if (!enrollment) return 'Unknown';
      if (enrollment <= 2000) {
        return 'Small';
      } else if (enrollment <= 15000) {
        return 'Medium';
      }
      return 'Large';
    };

    return (
      <div className="heading row">
        <div className="small-12 column">
          <h1>{it.name}</h1>
          <div className="caution-flag">
            <AlertBox
                content={(<a href="#viewWarnings" onClick={this.props.onViewWarnings}>View cautionary information about this school</a>)}
                isVisible={!!it.cautionFlag}
                status="warning"/>
          </div>
          <p style={{ marginBottom: '1.5em' }}>
            <strong>{formatNumber(it.studentCount)}</strong> GI Bill students
            (<a onClick={this.props.onLearnMore}>Learn more</a>)
          </p>
          <div className="small-12 usa-width-one-third medium-4column">
            <p>
              <IconWithInfo icon="map-marker" present={it.city && it.country}>
                {it.city}, {it.state || it.country}
              </IconWithInfo>
            </p>
            <p style={{ display: 'block' }}>
              <IconWithInfo icon="globe" present={it.website}>
                <a href={it.website} target="_blank">{it.website}</a>
              </IconWithInfo>
            </p>
            <p>
              <IconWithInfo icon="calendar-o" present={it.type !== 'ojt' && it.highestDegree}>
                {_.isFinite(it.highestDegree) ? `${it.highestDegree} year` : it.highestDegree} program
              </IconWithInfo>
            </p>
          </div>
          <div className="small-12 usa-width-one-third medium-4column">
            <p>
              <IconWithInfo icon="briefcase" present={it.type === 'ojt'}>
                On-the-job training
              </IconWithInfo>
            </p>
            <p>
              <IconWithInfo icon="institution" present={it.type && it.type !== 'ojt'}>
                {_.capitalize(it.type)}&nbsp;
                {it.type === 'for profit' ? 'school' : 'institution'}
              </IconWithInfo>
            </p>
            <p>
              <IconWithInfo icon="map" present={it.localeType && it.type && it.type !== 'ojt'}>
                {_.capitalize(it.localeType)} locale
              </IconWithInfo>
            </p>
            <p>
              <IconWithInfo icon="group" present={it.type && it.type !== 'ojt'}>
                {schoolSize(it.undergradEnrollment)} size
              </IconWithInfo>
            </p>
          </div>
          <div className="small-12 usa-width-one-third medium-4column"></div>
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
