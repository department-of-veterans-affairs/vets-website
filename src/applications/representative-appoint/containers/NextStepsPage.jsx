import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import scrollTo from 'platform/utilities/ui/scrollTo';
import ContactCard from '../components/ContactCard';
import AddressBlock from '../components/AddressBlock';
import GetFormHelp from '../components/GetFormHelp';

import {
  addressExists,
  getFormSubtitle,
  getOrgName,
  getRepType,
  getEntityAddressAsObject,
} from '../utilities/helpers';

export default function NextStepsPage() {
  const { data: formData } = useSelector(state => state.form);
  const selectedEntity = formData['view:selectedRepresentative'];
  const repType = getRepType(selectedEntity);
  const entityAttributes = selectedEntity?.attributes;
  const addressData = getEntityAddressAsObject(entityAttributes);
  const repName = entityAttributes?.fullName;
  const orgName = getOrgName(formData);

  useEffect(() => {
    scrollTo('topScrollElement');
  }, []);

  return (
    <div>
      <FormTitle
        title="Request help from a VA accredited representative or VSO"
        subTitle={getFormSubtitle(formData)}
      />
      <h2>Your next steps</h2>
      <p className="vads-u-margin-bottom--3">
        Both you and the accredited {repType} will need to sign your form. You
        can bring your form to them in person or mail it to them.
      </p>
      {addressExists(addressData) && (
        <AddressBlock
          repName={repName}
          orgName={orgName}
          addressData={addressData}
        />
      )}
      <p>
        After your form is signed, you or the accredited {repType} can submit it
        online, by mail, or in person.
      </p>
      <va-link
        href="/get-help-from-accredited-representative"
        text="Learn how to submit your form"
        external
      />
      <h2 className="vads-u-margin-top--3">
        After you submit your printed form
      </h2>
      <p>
        We usually process your form within 1 week. You can contact the
        accredited representative any time.
      </p>
      <ContactCard
        repName={repName}
        orgName={orgName}
        addressData={addressData}
        phone={entityAttributes?.phone}
        email={entityAttributes?.email}
      />
      <a className="vads-c-action-link--green vads-u-margin-top--2" href="/">
        Go back to VA.gov
      </a>
      <div>
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </div>
  );
}
