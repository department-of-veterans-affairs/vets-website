import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

const SideBar = () => {
  return (
    <div className="medium-screen:vads-u-padding-left--4">
      <div className="vads-u-margin-bottom--5">
        <h3 className="vads-u-margin-top--0 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
          Can I change my appointed representative?
        </h3>
        <p>
          Yes, you can change your representative for VA claims. If you know the
          group or individual you want to choose, click the change your
          representative button below your current representative information.
          If you want to search for a new representative (including a recognized
          VSO, attorney, or claims agent) by location, or the organization’s
          name, use our search tool.{' '}
        </p>
      </div>
      <div className="vads-u-margin-bottom--5">
        <h3 className="vads-u-margin-top--0 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
          What does it cost to use a recognized representative or a VSO?
        </h3>
        <p>
          No one should charge you a fee to help you file your initial
          application for benefits, but they may charge you for unusual
          expenses. Representatives may charge for their services only after
          we’ve made a decision about your original claim. Ask up front what
          fees you’ll be charged. If you believe a claims agent or attorney
          charged a fee that’s too high, you can challenge it.{' '}
        </p>
      </div>
      <div className="vads-u-margin-bottom--5">
        <h3 className="vads-u-margin-top--0 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
          What if I have questions?
        </h3>
        <p>
          You can call us at <Telephone contact={CONTACTS.VA_BENEFITS} />. We're
          here Monday through Friday, 8:00 a.m. to 9:00 p.m. E.T.
        </p>
      </div>
    </div>
  );
};

export default SideBar;
