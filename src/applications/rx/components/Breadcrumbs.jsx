import _ from 'lodash';
import { Link } from 'react-router';
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

import recordEvent from '../../../platform/monitoring/record-event';

class RxBreadcrumbs extends React.Component {
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
      <a href="/" key="home" onClick={() => { recordEvent({ event: 'nav-breadcrumb' });}}>Home</a>,
      <a href="/health-care/" key="healthcare">Health Care</a>,
      <Link to="/" key="prescriptions">Prescription Refills</Link>
    ];

    if (pathname.match(/\/\d+\/?(track)?$/)) {
      const prescriptionId = _.get(
        prescription,
        ['rx', 'attributes', 'prescriptionId']
      );

      crumbs.push(<Link to={`/${prescriptionId}`} key="prescription-name">Prescription Details</Link>);
    } else if (pathname.match(/\/glossary\/?$/)) {
      crumbs.push(<Link to="/glossary" key="glossary">Glossary</Link>);
    } else if (pathname.match(/\/settings\/?$/)) {
      crumbs.push(<Link to="/settings" key="settings">Settings</Link>);
    }

    return (
      <Breadcrumbs>
        {crumbs}
      </Breadcrumbs>
    );
  }
}

export default RxBreadcrumbs;
