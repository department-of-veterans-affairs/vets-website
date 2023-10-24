import React from 'react';

const RepTypeSelector = () => {
  return (
    <>
      <div className="rep-type-selector">
        <div>
          <h3>Select your Representative type:</h3>
        </div>

        <va-checkbox-group error={null} hint={null} label-header-level="" uswds>
          <va-checkbox
            label="Veteran Service Organization (VSO)"
            name="example"
            uswds
            value="1"
          />
          <va-checkbox label="Attorney" name="example" uswds value="2" />
          <va-checkbox label="Claims Agent" name="example" uswds value="3" />
        </va-checkbox-group>
        <div className="rep-type-info">
          <va-additional-info trigger="What is my representative type?" uswds>
            <div>
              <p>
                <strong>Veteran Services Organizations (VSOs) </strong>
                are recognized and accredited by the VA and offer services free
                of charge for Veterans and their families. VSOs help gather
                evidence to submit a Fully Developed Claim and can correspond
                with the VA about a claim on behalf of a Veteran.
              </p>
              <p>
                <strong>Attorneys</strong> can provide similar services as VSOs,
                but usually specialie appeals and can provide more dedication to
                the Veteran throughout the claims process. Attorneys will charge
                a fee for their services.
              </p>
              <p>
                <strong>Claims agents</strong> can provide similar services as
                VSOs, but they function independently. Claims agents will charge
                a fee for their services.
              </p>
            </div>
          </va-additional-info>
        </div>
      </div>
    </>
  );
};

export default RepTypeSelector;
