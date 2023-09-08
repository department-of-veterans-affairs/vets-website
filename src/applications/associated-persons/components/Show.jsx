import React from 'react';
import Edit from './Edit';

const headings = {
  'nextOfKinPrimary': 'Next of kin',
  'nextOfKinOther': 'Next-of-Kin, Other',
  'emergencyContactPrimary': 'Emergency Contact, Primary',
  'emergencyContactOther': 'Emergency Contact, Other'
};

const Show = props => {
  let { name, relationship, address, phoneNumber, variant } = props;

  return (
    <section className="vads-u-margin-top--2 vads-u-margin-bottom--6">
      <h2
        className="heading vads-u-background-color--gray-lightest vads-u-border-color--gray-lighter vads-u-color--gray-darkest vads-u-border-top--1px vads-u-border-left--1px vads-u-border-right--1px vads-u-margin--0 vads-u-padding-x--2 vads-u-padding-y--1p5 vads-u-font-size--h3 medium-screen:vads-u-padding-x--4 medium-screen:vads-u-padding-y--2"
      >
        {headings[variant]}
      </h2>

      <div
        className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border--1px"
      >
        <h3
          className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--bold vads-u-margin--0 vads-u-width--auto"
          >
            Name
        </h3>
        { name }
      </div>

      <div
        className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border-top--0px vads-u-border-left--1px vads-u-border-right--1px vads-u-border-bottom--1px"
      >
        <h3
          className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--bold vads-u-margin--0 vads-u-width--auto"
          >
            Relationship
        </h3>
        { relationship }
      </div>

      <div
        className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border-top--0px vads-u-border-left--1px vads-u-border-right--1px vads-u-border-bottom--1px"
      >
        <h3
          className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--bold vads-u-margin--0 vads-u-width--auto"
          >
            Address
        </h3>
        { address }
      </div>

      <div
        className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border-top--0px vads-u-border-left--1px vads-u-border-right--1px vads-u-border-bottom--1px"
      >
        <h3
          className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--bold vads-u-margin--0 vads-u-width--auto"
          >
            Phone
        </h3>
        { phoneNumber }
      </div>

      <div
        className="row vads-u-border-color--gray-lighter vads-u-color-gray-dark vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--1p5 medium-screen:vads-u-padding--4 vads-u-border-top--0px vads-u-border-left--1px vads-u-border-right--1px vads-u-border-bottom--1px"
      >
        <h3
          className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--bold vads-u-margin--0 vads-u-width--auto"
          >
            Work phone
        </h3>
        { phoneNumber }

        <va-button text="Edit" />
      </div>
    </section>
  )
};

Show.defaultProps = {
  name: "Jonnie Shaye",
  relationship: "Brother",
  address: "123 Main St, Ste 234; Los Angeles, CA 90089",
  phoneNumber: "111-222-3333",
};

export default Show;
