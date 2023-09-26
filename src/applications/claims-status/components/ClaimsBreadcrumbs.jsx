import React from 'react';
import { Link } from 'react-router';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

class ClaimsBreadcrumbs extends React.Component {
  renderBreadcrumbs = childNodes => {
    const crumbs = [
      <a href="/" key="home">
        Home
      </a>,
      <Link to="your-claims" key="claims-home">
        Check your claims and appeals
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
      <VaBreadcrumbs>
        {this.renderBreadcrumbs(this.props.children)}
      </VaBreadcrumbs>
    );
  }
}

export default ClaimsBreadcrumbs;
