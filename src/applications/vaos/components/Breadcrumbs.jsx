import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

export default class VAOSBreadcrumbs extends React.Component {
  renderBreadcrumbs = childNodes => {
    const crumbs = [
      <a href="/" key="home">
        Home
      </a>,
      <a href="/health-care" key="health-care">
        Health care
      </a>,
      <Link to="/" key="vaos-home">
        VA Online Scheduling
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
      <Breadcrumbs customClasses="new-grid">
        {this.renderBreadcrumbs(this.props.children)}
      </Breadcrumbs>
    );
  }
}
