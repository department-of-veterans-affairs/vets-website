import React from 'react';
import { useSelector } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import AddressBlock from '../components/AddressBlock';
import NeedHelp from '../components/NeedHelp';

export default function NextStepsPage() {
  const { data: formData } = useSelector(state => state.form);

  // Mock data until selected rep and org attributes are added to formData
  formData.selectedRepName = 'Steven McBob';
  formData.selectedOrgName = 'Best VSO';
  formData.address1 = '123 Main Street';
  formData.address2 = undefined;
  formData.city = 'Anytown';
  formData.state = 'VT';
  formData.zip = '05495';

  const repAddress = {
    address1: formData.address1,
    address2: formData.address2,
    city: formData.city,
    state: formData.state,
    zip: formData.zip,
  };

  const getRepType = () => {
    // const repType = formData.repTypeRadio;
    const repType = 'Attorney';

    if (repType === 'Attorney' || repType === 'Claims Agent') {
      return repType.toLowerCase();
    }

    return 'VSO representative';
  };

  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <FormTitle
          title="Fill out your form to appoint a VA accredited representative or VSO"
          subTitle="VA Forms 21-22 and 21-22a"
        />
        <h2 className="vads-u-font-size--h3">Your next steps</h2>
        <p>
          Both you and the accredited {getRepType()} will need to sign your
          form. You can bring your form to them in person or mail it to them.
        </p>
        <AddressBlock
          repName={formData.selectedRepName}
          orgName={formData.selectedOrgName}
          address={repAddress}
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
        <p>ORG CARD GOES HERE</p>
        <NeedHelp />
      </div>
    </div>
  );
}
