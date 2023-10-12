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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
              dignissim at felis in rhoncus. Phasellus ullamcorper libero at
              egestas commodo. Integer facilisis dapibus libero, dapibus pretium
              lorem vulputate in. Vestibulum ante ipsum primis in faucibus orci
              luctus
            </div>
          </va-additional-info>
        </div>
      </div>
    </>
  );
};

export default RepTypeSelector;
