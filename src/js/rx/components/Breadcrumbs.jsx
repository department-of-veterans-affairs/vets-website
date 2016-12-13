import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class Breadcrumbs extends React.Component {
  render() {
    const { pathname } = this.props.location;
    const { prescription } = this.props;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/healthcare" key="healthcare">Health Care</a>,
    ];

    if (pathname.match(/\/\d+$/)) {
      crumbs.push(<a href="/healthcare/prescriptions" key="prescriptions">Prescription Refills</a>);
      if (prescription) {
        const prescriptionName = _.get(prescription, [
          'rx',
          'attributes',
          'prescriptionName'
        ]);

        crumbs.push(<span key="currentPrescription"><strong>{prescriptionName}</strong></span>);
      }
    } else if (pathname.match(/\/glossary\/$/)) {
      crumbs.push(<a href="/healthcare/prescriptions" key="prescriptions">Prescription Refills</a>);
      crumbs.push(<span key="glossary"><strong>Glossary</strong></span>);
    } else {
      crumbs.push(<span key="prescriptions"><strong>Prescription Refills</strong></span>);
    }

    return (<div className="rx-breadcrumbs">
      {[].concat(...crumbs.map(e => [' › ', e])).slice(1)}
    </div>);
  }
}

const mapStateToProps = (state) => {
  return {
    prescription: state.prescriptions.currentItem,
  };
};

export default connect(mapStateToProps)(Breadcrumbs);
