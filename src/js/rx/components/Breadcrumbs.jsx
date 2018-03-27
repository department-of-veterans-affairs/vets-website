import _ from 'lodash';
import { Link } from 'react-router';
import React from 'react';
import { buildMobileBreadcrumb, debouncedToggleLinks } from '../../utils/breadcrumb-helper';

class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prevPath: '',
    };
  }

  componentDidMount() {
    buildMobileBreadcrumb('va-breadcrumb-prescriptions', 'va-breadcrumb-prescriptions-list');

    window.addEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.addEventListener('resize', () => {
      debouncedToggleLinks('va-breadcrumb-prescriptions-list');
      debouncedToggleLinks.bind(this);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ prevPath: this.props.location.pathname });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('DOMContentLoaded', () => {
      buildMobileBreadcrumb.bind(this);
    });

    window.removeEventListener('resize', () => {
      debouncedToggleLinks.bind(this);
    });
  }

  render() {
    const { location: { pathname }, prescription } = this.props;

    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/health-care/" key="healthcare">Health Care</a>,
    ];

    if (pathname.match(/\/\d+$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);

      if (this.state.prevPath.match(/\/history\/?$/)) {
        crumbs.push(<Link to="/history" key="history">History</Link>);
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
      }
    } else if (pathname.match(/\/history\/?$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);
    } else if (pathname.match(/\/glossary\/?$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);
    } else if (pathname.match(/\/settings\/?$/)) {
      crumbs.push(<Link to="/" key="prescriptions">Prescription Refills</Link>);
    }
    return (
      <nav
        aria-label="Breadcrumb"
        className="va-nav-breadcrumbs"
        id="va-breadcrumb-prescriptions">
        <ul
          className="row va-nav-breadcrumbs-list columns"
          id="va-breadcrumb-prescriptions-list"
          role="menubar">
          {crumbs.map((c, i) => {
            return <li key={i}>{c}</li>;
          })}
        </ul>
      </nav>
    );
  }
}

export default Breadcrumbs;
