import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { buildHours } from '../../facility-locator/utils/facilityHours';
import FacilityAddress from './FacilityAddress';
import FacilityPhone from './FacilityPhone';
import FacilityApiAlert from './FacilityApiAlert';
import { connect } from 'react-redux';

export class FacilityDetailWidget extends React.Component {
  render() {
    if (this.props.loading || !Object.keys(this.props.facility).length) {
      return <LoadingIndicator message="Loading facility..." />;
    }

    if (this.props.error) {
      return <FacilityApiAlert />;
    }

    const facilityDetail = this.props.facility;

    // Sort and compile facility hours into a list
    const hours = facilityDetail.attributes.hours;
    const builtHours = buildHours(hours, true);
    const clinicalHours = builtHours.map((day, index) => {
      const splitDay = day.split(': ');
      const abbrvDay = splitDay[0];
      const times = splitDay[1];

      let el = '';
      if (index === 0 || index === 5) {
        el += `<ul class="vads-u-flex--1 va-c-facility-hours-list vads-u-margin-top--0 ${
          index === 0
            ? 'vads-u-margin-bottom--1 small-screen:vads-u-margin-bottom--0'
            : 'vads-u-margin-bottom--0'
        }">`;
      }

      el += `<li key=${index}>
                <b class="abbrv-day">${abbrvDay}:</b> ${times}
              </li>`;

      if (index === 4 || index === 6) {
        el += '</ul>';
      }

      return el;
    });

    return (
      <div key={facilityDetail.id} className="vads-c-facility-detail">
        <section className="vads-facility-detail">
          <FacilityAddress facility={facilityDetail} />
          <FacilityPhone facility={facilityDetail} />
          <div className="vads-u-margin-bottom--0">
            <div className="clinicalhours">
              <h3 className="vads-u-margin-top--2p5 vads-u-margin-bottom--1">
                Clinical Hours
              </h3>
              <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row vads-u-margin-bottom--0">
                {ReactHtmlParser(clinicalHours.join(''))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  facility: store.facility.data,
  loading: store.facility.loading,
  error: store.facility.error,
});

export default connect(mapStateToProps)(FacilityDetailWidget);
