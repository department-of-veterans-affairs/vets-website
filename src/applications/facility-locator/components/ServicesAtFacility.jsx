import React, { Component } from 'react';
import { object } from 'prop-types';
import moment from 'moment';
import { vetCenterServices } from '../config';
import { formatServiceName } from '../utils/formatServiceName';
import { FacilityType } from '../constants';

/**
 * VA Facility-specific Services Component
 */
class ServicesAtFacility extends Component {
  renderService(service) {
    const label = formatServiceName(service);

    return (
      <li key={service} className="service-block">
        <span className="l1-services">{label}</span>
      </li>
    );
  }

  renderServices() {
    const { facility } = this.props;

    switch (facility.attributes.facilityType) {
      case FacilityType.VA_HEALTH_FACILITY:
        return this.renderHealthServices();
      case FacilityType.VA_BENEFITS_FACILITY:
        return this.renderBenefitsServices();
      case FacilityType.VET_CENTER:
        return this.renderVetCenterServices();
      default:
        return null;
    }
  }

  renderVetCenterServices() {
    return (
      <div className="vads-u-margin-bottom--4">
        <ul>
          {vetCenterServices.map(s => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    );
  }

  renderBenefitsServices() {
    const {
      facility: {
        attributes: { services },
      },
    } = this.props;

    if (
      !services.benefits ||
      services.benefits.length === 0 ||
      (services.benefits.standard && services.benefits.standard.length === 0)
    ) {
      return null;
    }

    /**
     * Since moving to v1 the services object changed. For now,
     * supporting v0 as the implementation is still on flipper.
     *
     * v0  - services.benefits.standard
     * v1  - services.benefits
     */
    return (
      <div className="vads-u-margin-bottom--4">
        <ul>
          {(services.benefits.standard &&
            services.benefits.standard.map(s => this.renderService(s))) ||
            services.benefits.map(s => this.renderService(s))}
        </ul>
      </div>
    );
  }

  renderHealthServices() {
    const {
      facility: {
        attributes: { services },
      },
    } = this.props;

    if (!services.health) {
      return null;
    }

    return (
      <div>
        <p style={{ margin: '0 0 0.5em' }}>
          Services current as of&nbsp;
          <strong>{moment(services.last_updated).format('LL')}</strong>
        </p>

        <div className="vads-u-margin-bottom--4">
          <va-alert visible status="warning" uswds="false">
            <h2 slot="headline">
              This list may not include all of the services available at this
              location
            </h2>
            <div>
              <p>
                Please check on the facility’s website or call them for this
                information.
              </p>
            </div>
          </va-alert>
        </div>

        <div className="vads-u-margin-bottom--4">
          <ul>
            {services.health.map(
              s =>
                s.sl1 ? this.renderService(s.sl1[0]) : this.renderService(s),
            )}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    const services = this.renderServices();

    if (!services) {
      return null;
    }

    return (
      <div>
        <h2 className="highlight">Services</h2>
        {services}
      </div>
    );
  }
}

ServicesAtFacility.propTypes = {
  facility: object,
};

export default ServicesAtFacility;
