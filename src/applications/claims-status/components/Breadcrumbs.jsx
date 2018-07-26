import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

class ClBreadcrumbs extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      this.renderBreadcrumbs();
    }
  }

  renderBreadcrumbs = childNodes => {
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/disability-benefits/" key="disability-benefits">Disability Benefits</a>,
      <Link to="/" key="claims-home">Track Your Claims and Appeals</Link>
    ];

    // Allow ClBreadcrumbs component to pass additional children
    // and re-render the Formation Breadcrumbs
    if (childNodes) {
      crumbs.push(...childNodes);
    }

    return crumbs;
  }

  render() {
    return (
      <Breadcrumbs>
        {this.renderBreadcrumbs(this.props.children)}
      </Breadcrumbs>
    );
  }
}

export default ClBreadcrumbs;
