import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class ServicesAtFacility extends Component {
  renderService(l1Service = '') {
    const services = this.props.info;
    const label = l1Service.replace(/([A-Z])/g, ' $1');
    return (
      <div className="service-block">
        <span className="l1-services">
          {label}: {services[l1Service]}
        </span>
      </div>
    );
  }

  render() {
    if (!this.props.info) {
      return (
        <div></div>
      );
    }
    return (
      <div>
        <Tabs selectedIndex={0} >
          <TabList>
            <Tab>Health</Tab>
            <Tab>Benefits</Tab>
          </TabList>
          <TabPanel>
            {this.renderService('Audiology')}
            {this.renderService('ComplementaryAlternativeMed')}
            {this.renderService('DentalServices')}
            {this.renderService('DiagnosticServices')}
            {this.renderService('ImagingAndRadiology')}
            {this.renderService('LabServices')}
            {this.renderService('EmergencyDept')}
            {this.renderService('EyeCare')}
            {this.renderService('MentalHealthCare')}
            {this.renderService('OutpatientMHCare')}
            {this.renderService('OutpatientSpecMHCare')}
            {this.renderService('VocationalAssistance')}
            {this.renderService('OutpatientMedicalSpecialty')}
            {this.renderService('AllergyAndImmunology')}
            {this.renderService('CardiologyCareServices')}
            {this.renderService('DermatologyCareServices')}
            {this.renderService('Diabetes')}
            {this.renderService('Dialysis')}
            {this.renderService('Endocrinology')}
            {this.renderService('Gastroenterology')}
            {this.renderService('Hematology')}
            {this.renderService('InfectiousDisease')}
            {this.renderService('InternalMedicine')}
            {this.renderService('Nephrology')}
            {this.renderService('Neurology')}
            {this.renderService('Oncology')}
            {this.renderService('PulmonaryRespiratoryDisease')}
            {this.renderService('Rheumatology')}
            {this.renderService('SleepMedicine')}
            {this.renderService('OutpatientSurgicalSpecialty')}
            {this.renderService('CardiacSurgery')}
            {this.renderService('ColoRectalSurgery')}
            {this.renderService('ENT')}
            {this.renderService('GeneralSurgery')}
            {this.renderService('Gynecology')}
            {this.renderService('Neurosurgery')}
            {this.renderService('Orthopedics')}
            {this.renderService('PainManagement')}
            {this.renderService('PlasticSurgery')}
            {this.renderService('Podiatry')}
            {this.renderService('ThoracicSurgery')}
            {this.renderService('Urology')}
            {this.renderService('VascularSurgery')}
            {this.renderService('PrimaryCare')}
            {this.renderService('Rehabilitation')}
            {this.renderService('UrgentCare')}
            {this.renderService('WellnessAndPreventativeCare')}
          </TabPanel>
          <TabPanel/>
        </Tabs>
      </div>
    );
  }
}

export default ServicesAtFacility;
