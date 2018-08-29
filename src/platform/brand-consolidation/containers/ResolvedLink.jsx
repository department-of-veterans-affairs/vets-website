import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ROUTES from '../constants/redirects.json';

function ResolveLink({ resolvedHref, children }) {
  if (resolvedHref === children.props.href) return children;
  return React.cloneElement(children, {
    ...children.props,
    href: resolvedHref
  });
}

export function mapStateToProps(state, ownProps, routesData = ROUTES) {
  const child = ownProps.children;
  const vetsPagePath = child.props.href;
  const { brandConsolidation } = state.buildSettings;

  let resolvedHref = null;

  if (!brandConsolidation.enabled) {
    resolvedHref = vetsPagePath;
  } else {
    const route = routesData.find(r => r['vets.gov'] === vetsPagePath);
    resolvedHref = route ? route['va.gov'] : vetsPagePath;
  }

  return {
    resolvedHref
  };
}

/**
 * A wrapper around anchor tags to invisibly convert HREF values from the Vets.gov page path to the brand-consolidation page path.
 * @property {element} children A single link tagging containing an HREF property to be resolved based on the brand-consolidation feature flag.
 */
const ResolveLinkContainer = connect(mapStateToProps, null)(ResolveLink);

ResolveLinkContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element
  ])
};

export default ResolveLinkContainer;
export { ResolveLink };
