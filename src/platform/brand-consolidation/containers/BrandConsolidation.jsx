import React from 'react';
import { connect } from 'react-redux';

function BrandConsolidation({ brandConsolidationEnabled, children }) {
  if (brandConsolidationEnabled) {
    return <div data-brand-consolidation-enabled>{children}</div>;
  }
  return null;
}

export function mapStateToProps(state) {
  return {
    brandConsolidationEnabled: state.buildSettings.brandConsolidationEnabled,
  };
}

/**
 * A component that renders its children only during brand-consolidation builds.
 * @property {object|array} children The React nodes that should be visible for brand-consolidation builds.
 */
const BrandConsolidationContainer = connect(
  mapStateToProps,
  null,
)(BrandConsolidation);
export { BrandConsolidation };

export default BrandConsolidationContainer;
