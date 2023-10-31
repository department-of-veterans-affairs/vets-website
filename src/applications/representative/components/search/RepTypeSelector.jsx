import React from 'react';

const RepTypeSelector = ({ onChange }) => {
  const handleRadioButtonSelect = event => {
    onChange({ representativeType: event.detail.value });
  };

  return (
    <>
      <div className="rep-type-selector">
        <va-radio
          error={null}
          header-aria-describedby="Select your Representative type:"
          hint=""
          label=""
          label-header-level="3"
          onVaValueChange={handleRadioButtonSelect}
        >
          <va-radio-option
            label="Veteran Service Organization (VSO)"
            name="VSO"
            value="Veteran Service Organization (VSO)"
            checked
          />
          <va-radio-option label="Attorney" name="Attorney" value="Attorney" />
          <va-radio-option
            label="Claims Agent"
            name="Claims Agent"
            value="Claims Agent"
          />
        </va-radio>

        <div style={{ marginTop: '2em' }}>
          <va-accordion
            disable-analytics={{
              value: 'false',
            }}
            section-heading={{
              value: 'null',
            }}
            uswds={{
              value: 'false',
            }}
            open-single
          >
            <va-accordion-item id="first">
              <h6 slot="headline">
                How can each type of representative help me?
              </h6>
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
            </va-accordion-item>
          </va-accordion>
        </div>
      </div>
    </>
  );
};

export default RepTypeSelector;
