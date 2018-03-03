import React from 'react';
import Accordion, { AccordionTab } from '../../common/components/Accordion';

class ProfileAccordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeAccordionId: 'veteran-information' };
  }
  onAccordionTabClick = (accordionId) => {
    const activeAccordionId = this.state.activeAccordionId === accordionId ? '' : accordionId;
    this.setState({ activeAccordionId });
  }
  render() {
    return (
      <Accordion>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="veteran-information" title="Veteran Information">
          <h3>Veteran Information</h3>
        </AccordionTab>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="military-service" title="Military Service">
          <h3>Military Service</h3>
        </AccordionTab>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="va-benefits" title="VA Benefits">
          <h3>VA Benefits</h3>
        </AccordionTab>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="household-information" title="Household Information">
          <h3>Household Information</h3>
        </AccordionTab>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="insurance-information" title="Insurance Information">
          <h3>Insurance Information</h3>
        </AccordionTab>
      </Accordion>
    );
  }
}

export default ProfileAccordion;
