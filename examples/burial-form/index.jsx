import React, { useContext } from 'react';
import {Navigate, Route, useLocation} from 'react-router-dom'
import {FormRouter, ConditionalRoute} from '@department-of-veterans-affairs/va-forms-system-core';
import BurialIntroduction from './BurialIntroduction';
import ClaimantInformation from './ClaimantInformation';
import VeteranInformation from './VeteranInformation';
import BurialInformation from './BurialInformation';
import MilitaryServiceHistory from './MilitaryServiceHistory';
import PreviousNames from './PreviousNames';
import PlotAllowance from './PlotAllowance';
import BurialAllowance from "./BurialAllowance";
import BenefitsSelection from './BenefitsSelection';
import ClaimantContactInformation from "./ClaimantContactInformation";
import ReviewPage from './ReviewPage';
import ConfirmationPage from "./ConfirmationPage";

const NoMatch = (props) => (
  <main style={{ padding: '1rem' }}>
    <p>There is nothing here! {props.name}</p>
  </main>
);



const mapProps = (values, actions) => {
}

const BurialApp = (props) => {
  // Let users extract and use formData here
  // initialValues would ideally be provided by a json-schema

  return (
    <div className='vads-u-display--flex vads-u-align-items--center vads-u-flex-direction--column'>
      <FormRouter basename={props.basename}
        formData={props.initialValues}
        title="Burials Example"
        transformForSubmit={mapProps}
        >
        <Route index element={<BurialIntroduction title="Introduction Page" />} />
        <Route path="/claimant-information" element={<ClaimantInformation title="Claimant Information" />} />
        <Route path="/veteran-information" element={<VeteranInformation title="Deceased Veteran Information" />} />
        <Route path="/veteran-information/burial" element={<BurialInformation title="Deceased Veteran Information" />} />
        <Route path="/military-history/service-periods" element={<MilitaryServiceHistory title="Military Service History" />} />
        <Route path="/military-history/previous-names" element={<PreviousNames title="Military history" />} />
        <Route path="/benefits/selection" element={<BenefitsSelection title="Benefits Selection" />} />
        <Route path="/benefits/burial-allowance" element={
          <ConditionalRoute title="Benefits Selection" type="conditional" condition={'benefitsSelection.burialAllowance'}>
            <BurialAllowance />
          </ConditionalRoute>}
        />
        <Route path="/benefits/plot-allowance" element={
          <ConditionalRoute title="Benefits Selection" type="conditional" condition={'benefitsSelection.plotAllowance'}>
            <PlotAllowance />
          </ConditionalRoute>}
        />
        <Route path="/claimant-contact-information" element={<ClaimantContactInformation title="Claimant contact information" />} />
        <Route path="/review-and-submit" element={<ReviewPage title="Review Your Application" />} />
        <Route path="/confirmation" element={<ConfirmationPage title="Confirmation Page" />} />
        <Route path="*" element={<NoMatch name="No Routes for App" />} />
      </FormRouter>
    </div>
  )
}

export default BurialApp