import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getBackendStatuses } from './actions';
import { EXTERNAL_SERVICES } from './config';

const OPERATIONAL_STATUSES = ['active'];

/**
 * A wrapper component that render its children if the application's dependencies are failing.
 * @property {node} children - Content to be rendered if there are failing dependencies.
 * @property {Array<string>} dependencies - Upstream services required by the application.
 * @property {function} getBackendStatuses - Gets the statuses of external backend services.
 */
class ExternalServicesError extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    dependencies: PropTypes.arrayOf(
      PropTypes.oneOf(Object.values(EXTERNAL_SERVICES)),
    ).isRequired,
    getBackendStatuses: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.props.shouldGetBackendStatuses) {
      this.props.getBackendStatuses();
    }
  }

  /**
   * Checks whether a service is a dependency and operational.
   * @param {Object} service - The service to be checked.
   * @param {string} service.serviceId - The service's human readable ID.
   * @param {string} service.status - The service's status.
   * @return {boolean} Whether the service is a failing dependency (true) or not (false).
   */
  isFailingDependency = ({ serviceId, status }) =>
    this.props.dependencies.includes(serviceId) &&
    !OPERATIONAL_STATUSES.includes(status);

  render() {
    const { children, statuses } = this.props;
    if (!statuses) return null;

    const shouldRender = statuses.some(this.isFailingDependency);
    if (!shouldRender) return null;

    return children;
  }
}

export const mapStateToProps = state => {
  const { loading, statuses } = state.externalServiceStatuses;
  const shouldGetBackendStatuses = !loading && !statuses;
  return { shouldGetBackendStatuses, statuses };
};

const mapDispatchToProps = { getBackendStatuses };

export { ExternalServicesError };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExternalServicesError);
