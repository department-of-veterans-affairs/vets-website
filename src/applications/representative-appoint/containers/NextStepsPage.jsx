import React from 'react';
import { useSelector } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import AddressBlock from '../components/AddressBlock';
import ContactCard from '../components/ContactCard';
import NeedHelp from '../components/NeedHelp';
import {
  getFormSubtitle,
  getOrgName,
  getRepType,
  getEntityAddressAsObject,
} from '../utilities/helpers';

export default function NextStepsPage() {
  const { data: formData } = useSelector(state => state.form);

  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <FormTitle
          title="Request help from a VA accredited representative or VSO"
          subTitle={getFormSubtitle(formData)}
        />
        <h2 className="vads-u-font-size--h3">Your next steps</h2>
        <p>
          Both you and the accredited {getRepType(formData)} will need to sign
          your form. You can bring your form to them in person or mail it to
          them.
        </p>
        <AddressBlock
          repName={formData['view:selectedRepresentative']?.fullName}
          orgName={getOrgName(formData)}
          address={getEntityAddressAsObject(formData)}
        />
        <p>
          After your form is signed, you or the accredited {getRepType()} can
          submit it online, by mail, or in person.
        </p>
        <va-link href="" text="Learn how to submit your form" />
        <h2 className="vads-u-font-size--h3">
          After you submit your printed form
        </h2>
        <p>
          We usually process your form within 1 week. You can contact the
          accredited representative any time.
        </p>
        <ContactCard
          repName={formData['view:selectedRepresentative']?.fullName}
          orgName={getOrgName(formData)}
          address={getEntityAddressAsObject(formData)}
          phone={formData['view:selectedRepresentative']?.phone}
          email={formData['view:selectedRepresentative']?.email}
        />
        <NeedHelp />
      </div>
    </div>
  );
}
