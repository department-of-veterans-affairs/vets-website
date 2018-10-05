import React from 'react';
import { connect } from 'react-redux';

function VetsDotGov({ vetsDotGovEnabled, children }) {
  if (vetsDotGovEnabled) {
    return <div data-brand-consolidation-enabled>{children}</div>;
  }
  return null;
}

export function mapStateToProps(state) {
  return {
    vetsDotGovEnabled: !state.buildSettings.brandConsolidationEnabled,
  };
}

/**
 * A component that renders its children only during regular/non-brand-consolidation builds.
 * @property {object|array} children The React nodes that should be visible for regular/non-brand-consolidation builds.
 */
const VetsDotGovContainer = connect(
  mapStateToProps,
  null,
)(VetsDotGov);
export { VetsDotGov };

export default VetsDotGovContainer;
