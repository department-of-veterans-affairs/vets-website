import React from 'react';
import { useSelector } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import ContactCard from '../components/ContactCard';
import AddressBlock from '../components/AddressBlock';
import NeedHelp from '../components/NeedHelp';
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
  const entityAttributes = selectedEntity?.attributes;
  const address = getEntityAddressAsObject(entityAttributes);
  const repName = entityAttributes?.fullName;
  const orgName = getOrgName(formData);
  const repType = getRepType(selectedEntity);

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
      {addressExists(address) && (
        <AddressBlock repName={repName} orgName={orgName} address={address} />
      )}
      <p>
        After your form is signed, you or the accredited {repType} can submit it
        online, by mail, or in person.
      </p>
      <va-link href="" text="Learn how to submit your form" />
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
        address={address}
        phone={entityAttributes?.phone}
        email={entityAttributes?.email}
      />
      <a className="vads-c-action-link--green vads-u-margin-top--2" href="/">
        Go back to VA.gov
      </a>
      <NeedHelp />
    </div>
  );
}
