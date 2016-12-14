import _ from 'lodash';
import { Link } from 'react-router';
import React from 'react';

class Breadcrumbs extends React.Component {
  render() {
    const { location: { pathname }, prescription } = this.props;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/healthcare" key="healthcare">Health Care</a>,
    ];

    if (pathname.match(/\/\d+$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);
      if (prescription) {
        const prescriptionName = _.get(prescription, [
          'rx',
          'attributes',
          'prescriptionName'
        ]);

        crumbs.push(<span key="currentPrescription"><strong>{prescriptionName}</strong></span>);
      }
    } else if (pathname.match(/\/glossary\/$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);
      crumbs.push(<span key="glossary"><strong>Glossary</strong></span>);
    } else {
      crumbs.push(<span key="prescriptions"><strong>Prescription Refills</strong></span>);
    }

    return (<div className="rx-breadcrumbs">
      {crumbs.reduce((content, e) => { return [...content, ' › ', e]; }, []).slice(1)}
    </div>);
  }
}

export default Breadcrumbs;
