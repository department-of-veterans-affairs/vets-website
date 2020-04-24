import React from 'react';
import { pageNames } from './pageList';
import { BDD_INFO_URL } from '../../constants';
import { BDD_FORM_ROOT_URL } from 'applications/disability-benefits/bdd/constants';

const FileBDDClaim = () => (
  <>
    <p>
      Based on your information, you may be eligible for the Benefits Delivery
      at Discharge program that allows service members to apply for VA
      disability benefits prior to separation.
    </p>
    <p>
      <a href={BDD_INFO_URL}>
        Learn more about Benefits Delivery at Discharge (BDD)
      </a>
    </p>
    <a
      href={`${BDD_FORM_ROOT_URL}/introduction`}
      className="usa-button-primary va-button-primary"
    >
      File a Benefits Delivery at Discharge claim
    </a>
  </>
);

export default {
  name: pageNames.fileBDD,
  component: FileBDDClaim,
};
