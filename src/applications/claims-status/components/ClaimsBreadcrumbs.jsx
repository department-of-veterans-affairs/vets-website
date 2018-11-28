import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

class ClaimsBreadcrumbs extends React.Component {
  renderBreadcrumbs = childNodes => {
    const crumbs = [
      <a href="/" key="home">
        Home
      </a>,
      <a href="/disability-benefits/" key="disability-benefits">
        Disability Benefits
      </a>,
      <Link to="your-claims" key="claims-home">
        Track Your Claims and Appeals
      </Link>,
    ];

    if (childNodes) {
      if (childNodes.length === undefined) {
        const childArr = React.Children.toArray(childNodes);
        crumbs.push(childArr);
      } else {
        crumbs.push(...childNodes);
      }
    }

    return crumbs;
  };

  render() {
    return (
      <Breadcrumbs>{this.renderBreadcrumbs(this.props.children)}</Breadcrumbs>
    );
  }
}

export default ClaimsBreadcrumbs;
