import React from 'react';
import { connect } from 'react-redux';

function VetsDotGov({ isVetsDotGov, children }) {
  if (isVetsDotGov) {
    return <div data-brand-consolidation-enabled>{children}</div>;
  }
  return null;
}

export function mapStateToProps(state) {
  return {
    isVetsDotGov: !state.buildSettings.brandConsolidationEnabled
  };
}

/**
 * A component that renders its children only during brand-consolidation builds.
 * @property {object|array} children The React nodes that should be visible for brand-consolidation builds.
 */
const VetsDotGovContainer = connect(mapStateToProps, null)(VetsDotGov);
export { VetsDotGov };

export default VetsDotGovContainer;
