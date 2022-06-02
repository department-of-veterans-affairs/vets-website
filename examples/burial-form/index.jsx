import React from 'react';
import { Route } from 'react-router-dom'
import { FormRouter } from '@department-of-veterans-affairs/va-forms-system-core';
import BurialIntroduction from './BurialIntroduction';
import ClaimantInformation from './ClaimantInformation';
import VeteranInformation from './VeteranInformation';
import BurialInformation from './BurialInformation';
import BurialAllowance from './BurialAllowance';
import MilitaryServiceHistory from './MilitaryServiceHistory';

const NoMatch = (props) => (
  <main style={{ padding: '1rem' }}>
    <p>There is nothing here! {props.name}</p>
  </main>
);

const BurialApp = (props) => {
  // Let users extract and use formData here
  // initialValues would ideally be provided by a json-schema
  return (
    <div className='vads-u-display--flex vads-u-align-items--center vads-u-flex-direction--column'>
      <FormRouter basename={props.basename} formData={props.initialValues} title="Burials Example">
        <Route index element={<BurialIntroduction title="Introduction Page" />} />
        <Route path="/claimant-information" element={<ClaimantInformation title="Claimant Information" />} />
        <Route path="/veteran-information" element={<VeteranInformation title="Deceased Veteran Information" />} />
        <Route path="/veteran-information/burial" element={<BurialInformation title="Deceased Veteran Information" />} />
        <Route path="/military-history/service-periods" element={<MilitaryServiceHistory title="Military Service History" />} />
        <Route path="/benefits/burial-allowance" element={<BurialAllowance title="Benefits Selection" />} />
        <Route path="*" element={<NoMatch name="No Routes for App" />} />
      </FormRouter>
    </div>
  )
}

export default BurialApp
