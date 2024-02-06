import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

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
      // Note: not using uswds option here because react-router Links are not compatible currently
      <va-breadcrumbs uswds="false">
        {this.renderBreadcrumbs(this.props.children)}
      </va-breadcrumbs>
    );
  }
}

ClaimsBreadcrumbs.propTypes = {
  children: PropTypes.node,
};

export default ClaimsBreadcrumbs;
