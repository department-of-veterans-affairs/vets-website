import { flattenDeep } from 'lodash';
import React, { Component } from 'react';

class ServicesAtFacility extends Component {

  static services = [
    'AllergyAndImmunology',
    'Audiology',
    'CardiacSurgery',
    'CardiologyCareServices',
    'ColoRectalSurgery',
    'ComplementaryAlternativeMed',
    'DentalServices',
    'DermatologyCareServices',
    'Diabetes',
    'DiagnosticServices',
    'Dialysis',
    'EmergencyDept',
    'Endocrinology',
    'ENT',
    'EyeCare',
    'Gastroenterology',
    'GeneralSurgery',
    'Gynecology',
    'Hematology',
    'ImagingAndRadiology',
    'InfectiousDisease',
    'InternalMedicine',
    'LabServices',
    'MentalHealthCare',
    'Nephrology',
    'Neurology',
    'Neurosurgery',
    'Oncology',
    'Orthopedics',
    'OutpatientMedicalSpecialty',
    'OutpatientMHCare',
    'OutpatientSpecMHCare',
    'OutpatientSurgicalSpecialty',
    'PainManagement',
    'PlasticSurgery',
    'Podiatry',
    'PrimaryCare',
    'PulmonaryRespiratoryDisease',
    'Rehabilitation',
    'Rheumatology',
    'SleepMedicine',
    'ThoracicSurgery',
    'UrgentCare',
    'Urology',
    'VascularSurgery',
    'VocationalAssistance',
    'WellnessAndPreventativeCare',
  ];

  renderService(service) {
    const label = service.replace(/([A-Z])/g, ' $1');

    return (
      <li key={service} className="service-block">
        <span className="l1-services">
          {label}
        </span>
      </li>
    );
  }

  renderServiceBlock(serviceArray) {
    const subServicesList = (subServices) => {
      if (subServices.length > 0) {
        return (
          <ul>
            {subServices.map((ss, i) => <li key={i}>{ss.replace(/([A-Z])/g, ' $1')}</li>)}
          </ul>
        );
      }
      return null;
    };

    return (
      <div key={serviceArray[0]} className="mb2">
        <h5>{serviceArray[0].replace(/([A-Z])/g, ' $1')}</h5>
        {subServicesList(serviceArray[1])}
      </div>
    );
  }

  // TODO: Use this method to render separate lists for each L1 service
  renderServices() {
    const { facility: { attributes: { services } } } = this.props;

    if (!services) {
      return null;
    }

    return (
      <div>
        {services.map(this.renderServiceBlock)}
      </div>
    );
  }

  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    const availableServices = ServicesAtFacility.services.filter(s => {
      return flattenDeep(facility.attributes.services).includes(s);
    });

    return (
      <div className="mb2">
        <h5>Health Services</h5>
        <ul>
          {availableServices.map(s => {
            return this.renderService(s);
          })}
        </ul>
      </div>
    );
  }
}

export default ServicesAtFacility;
