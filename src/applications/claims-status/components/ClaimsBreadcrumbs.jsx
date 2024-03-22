import React from 'react';
import { Link } from 'react-router';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory } from 'react-router-dom';

import { CST_BREADCRUMB_BASE } from '../constants';

import PropTypes from 'prop-types';

import manifest from '../manifest.json';

// class ClaimsBreadcrumbs extends React.Component {
//   renderBreadcrumbs = childNodes => {
//     const crumbs = [
//       <a href="/" key="home">
//         Home
//       </a>,
//       <Link to="your-claims" key="claims-home">
//         Check your claims and appeals
//       </Link>,
//     ];

//     if (childNodes) {
//       if (childNodes.length === undefined) {
//         const childArr = React.Children.toArray(childNodes);
//         crumbs.push(childArr);
//       } else {
//         crumbs.push(...childNodes);
//       }
//     }

//     return crumbs;
//   };

//   render() {
//     return (
//       // Note: not using uswds option here because react-router Links are not compatible currently
//       <va-breadcrumbs uswds="false">
//         {this.renderBreadcrumbs(this.props.children)}
//       </va-breadcrumbs>
//     );
//   }
// }

// ClaimsBreadcrumbs.propTypes = {
//   children: PropTypes.node,
// };

// export default ClaimsBreadcrumbs;

function ClaimsBreadcrumbs({ crumbs }) {
  const updatedCrumbs = crumbs.map(crumb => {
    href: `${manifest.rootUrl}/${crumb.href}`,
  },
 );
  const breadcrumbList = CST_BREADCRUMB_BASE.concat(updatedCrumbs);
  const history = useHistory();

  function handleRouteChange({ detail }) {
    const { href } = detail;
    history.push(href);
  }

  return (
    <VaBreadcrumbs
      breadcrumbList={breadcrumbList}
      onRouteChange={handleRouteChange}
    />
  );
}

ClaimsBreadcrumbs.propTypes = {
  crumbs: PropTypes.array,
};

export default ClaimsBreadcrumbs;
