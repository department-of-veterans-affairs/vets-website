import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { showModal } from '../../actions';
import AlertBox from '../../../common/components/AlertBox';
import If from '../If';

export class AdditionalInformation extends React.Component {

  render() {
    const it = this.props.profile.attributes;
    const schoolSize = (enrollment) => {
      if (!enrollment) return 'Unknown';
      if (enrollment <= 2000) {
        return 'Small';
      } else if (enrollment <= 15000) {
        return 'Medium';
      }
      return 'Large';
    };
    const domestic = <span>{it.city}, {it.state}</span>;
    const foreign = <span>{it.city}, {it.country}</span>;
    const place = (it.country === 'usa' ? domestic : foreign);
    const link = it.website ? <a href={it.website} target="_blank">{it.website}</a> : null;
    return (
      <div className="heading row">
        <div className="small-12 column">
          <h1>{it.name}</h1>
          <AlertBox
              content={(<p>VA has concerns about this school. <a href="#viewWarnings">View warnings</a></p>)}
              isVisible={!!it.cautionFlag}
              status="warning"/>
          <p style={{ marginBottom: '1.5em' }}>
            <strong>{it.studentCount}</strong> GI Bill students
            (<a onClick={this.props.showModal.bind(this, 'gibillstudents')}>Learn more</a>)
          </p>
          <div className="row">
            <div className="small-3 large-4 column">
              <p><i className="fa fa-map-marker"/> {place}</p>
              <p style={{ display: 'block' }}><i className="fa fa-globe"/> {link}</p>
              <If condition={it.type !== 'ojt' && (it.highestDegree === 2 || it.highestDegree === 4)}>
                <p><i className="fa fa-calendar-o"/> {it.highestDegree} year program</p>
              </If>
            </div>
            <div className="small-3 large-4 column">
              <If condition={it.type === 'ojt'}>
                <p><i className="fa fa-briefcase"/></p>
              </If>
              <If condition={it.type !== 'ojt'}>
                <span>
                  <p><i className="fa fa-institution"/> {_.capitalize(it.type)} institution</p>
                  <p><i className="fa fa-map"/> {_.capitalize(it.localeType)} locale</p>
                  <p><i className="fa fa-group"/> {schoolSize(it.undergradEnrollment)} size</p>
                </span>
              </If>
            </div>
            <div className="large-6 column"></div>
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
  showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalInformation);
