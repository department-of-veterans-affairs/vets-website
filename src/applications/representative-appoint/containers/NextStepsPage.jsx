import React from 'react';
import { useSelector } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { getFormSubtitle } from '../utilities/helpers';
import AddressBlock from '../components/AddressBlock';
import ContactCard from '../components/ContactCard';
import NeedHelp from '../components/NeedHelp';

export default function NextStepsPage() {
  const { data: formData } = useSelector(state => state.form);
  const repType =
    formData['view:selectedRepresentative'].attributes?.individualType;
  const address = {
    address1: (
      formData['view:selectedRepresentative']?.addressLine1 || ''
    ).trim(),
    address2: (
      formData['view:selectedRepresentative']?.addressLine2 || ''
    ).trim(),
    address3: (
      formData['view:selectedRepresentative']?.addressLine3 || ''
    ).trim(),
    city: (formData['view:selectedRepresentative']?.city || '').trim(),
    state: (formData['view:selectedRepresentative']?.stateCode || '').trim(),
    zip: (formData['view:selectedRepresentative']?.zipCode || '').trim(),
  };
  const isOrg =
    formData['view:selectedRepresentative']?.type === 'organization';
  const isAttorneyOrClaimsAgent =
    repType === 'attorney' || repType === 'claimsAgent';

  const getRepType = () => {
    if (repType === 'attorney') {
      return 'attorney';
    }

    if (repType === 'claimsAgent') {
      return 'claims agent';
    }

    return 'VSO representative';
  };

  const getOrgName = () => {
    if (isOrg) {
      return formData['view:selectedRepresentative'].name;
    }

    if (isAttorneyOrClaimsAgent) {
      return null;
    }

    const id = formData?.selectedAccreditedOrganizationId;
    const orgs =
      formData['view:selectedRepresentative']?.attributes
        .accreditedOrganizations.data;
    let orgName;

    if (id && orgs) {
      for (let i = 0; i < orgs.length; i += 1) {
        if (orgs[i].id === id) {
          orgName = orgs[i].attributes.name;
          break;
        }
      }
    }

    return orgName;
  };

  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <FormTitle
          title="Fill out your form to appoint a VA accredited representative or VSO"
          subTitle={getFormSubtitle(formData)}
        />
        <h2 className="vads-u-font-size--h3">Your next steps</h2>
        <p>
          Both you and the accredited {getRepType()} will need to sign your
          form. You can bring your form to them in person or mail it to them.
        </p>
        <AddressBlock
          repName={formData['view:selectedRepresentative']?.fullName}
          orgName={getOrgName()}
          address={address}
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
          orgName={getOrgName()}
          address={address}
          phone={formData['view:selectedRepresentative']?.phone}
          email={formData['view:selectedRepresentative']?.email}
        />
        <NeedHelp />
      </div>
    </div>
  );
}
