import _ from 'lodash';
import { Link } from 'react-router';
import React from 'react';

class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prevPath: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ prevPath: this.props.location.pathname });
    }
  }

  render() {
    const { location: { pathname }, prescription } = this.props;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/health-care" key="healthcare">Health Care</a>,
    ];

    if (pathname.match(/\/\d+$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);

      if (this.state.prevPath.match(/\/history\/?$/)) {
        crumbs.push(<Link to="/history" key="history">History</Link>);
      }

      if (prescription) {
        const prescriptionName = _.get(
          prescription,
          ['rx', 'attributes', 'prescriptionName']
        );

        crumbs.push(<span key="currentPrescription"><strong>{prescriptionName}</strong></span>);
      }
    } else if (pathname.match(/\/track\/?$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);

      if (this.state.prevPath.match(/\/history\/?$/)) {
        crumbs.push(<Link to="/history" key="history">History</Link>);
      }

      if (prescription) {
        const prescriptionId = _.get(
          prescription,
          ['rx', 'attributes', 'prescriptionId']
        );

        const prescriptionName = _.get(
          prescription,
          ['rx', 'attributes', 'prescriptionName']
        );

        crumbs.push(<Link to={`/${prescriptionId}`} key="history">{prescriptionName}</Link>);
        crumbs.push(<span key="trackPackage"><strong>Track Package</strong></span>);
      }
    } else if (pathname.match(/\/history\/?$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);
      crumbs.push(<span key="history"><strong>History</strong></span>);
    } else if (pathname.match(/\/glossary\/?$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);
      crumbs.push(<span key="glossary"><strong>Glossary</strong></span>);
    } else if (pathname.match(/\/settings\/?$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);
      crumbs.push(<span key="settings"><strong>Settings</strong></span>);
    } else {
      crumbs.push(<span key="prescriptions"><strong>Prescription Refills</strong></span>);
    }

    const lastElement = crumbs.pop();

    return (
      <nav className="va-nav-breadcrumbs">
        <ul className="row va-nav-breadcrumbs-list columns" role="menubar" aria-label="Primary">
          {crumbs.map((c, i) => {
            return <li key={i}>{c}</li>;
          })}
          <li className="active">{lastElement}</li>
        </ul>
      </nav>
    );
  }
}

export default Breadcrumbs;
