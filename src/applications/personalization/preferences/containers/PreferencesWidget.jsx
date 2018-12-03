import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import environment from 'platform/utilities/environment';

function AccordionWrapper({ children }) {
  return (
    <div className="usa-accordion">
      <ul className="usa-unstyled-list">{children}</ul>
    </div>
  );
}

function AccordionItem({ onToggle, expanded, buttonText, name, children }) {
  return (
    <li>
      <button
        className="usa-button-unstyled usa-accordion-button"
        aria-controls={name}
        aria-expanded={!!expanded}
        onClick={onToggle}
        name={name}
      >
        {buttonText}
      </button>
      <div id={name} className="usa-accordion-content" aria-hidden={!expanded}>
        <div itemProp="text">{children}</div>
      </div>
    </li>
  );
}

class PreferencesWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleAccordionToggle = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: !this.state[e.target.name],
    });
  };

  render() {
    // do not show in production
    if (environment.isProduction()) {
      return null;
    }

    return (
      <div className="row user-profile-row">
        <div className="small-12 columns">
          <div className="title-container">
            <h2>Find VA Benefits</h2>
            <Link to="preferences">Find VA Benefits Settings</Link>
          </div>
          <div>
            <AccordionWrapper>
              <AccordionItem
                onToggle={this.handleAccordionToggle}
                name="exampleBenefit"
                buttonText="Example Benefit"
                expanded={this.state.exampleBenefit}
              >
                <p>TBD benefit content</p>
              </AccordionItem>
            </AccordionWrapper>
            <AccordionWrapper>
              <AccordionItem
                onToggle={this.handleAccordionToggle}
                name="exampleBenefitTwo"
                buttonText="Example Benefit Two"
                expanded={this.state.exampleBenefitTwo}
              >
                <p>TBD benefit content</p>
              </AccordionItem>
            </AccordionWrapper>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreferencesWidget);
export { PreferencesWidget };
