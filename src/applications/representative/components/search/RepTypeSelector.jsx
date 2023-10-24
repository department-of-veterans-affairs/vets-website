import React from 'react';

const RepTypeSelector = () => {
  return (
    <>
      <div className="rep-type-selector">
        <va-radio
          error={null}
          header-aria-describedby="Select your Representative type:"
          hint=""
          label="Select your Representative type:"
          label-header-level="3"
        >
          <va-radio-option
            label="Veteran Service Organization (VSO)"
            name="VSO"
            value="1"
          />
          <va-radio-option label="Attorney" name="Attorney" value="2" />
          <va-radio-option label="Claims Agent" name="Claims Agent" value="2" />
        </va-radio>

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
                but usually specialize in appeals. They can provide more
                dedicated help throughout the claims process. Attorneys charge a
                fee for their services.
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
