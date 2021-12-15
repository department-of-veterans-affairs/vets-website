import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { ViewRepresentativeDetails } from './ViewRepresentativeDetails';

const ViewRepresentativeBody = props => {
  const { loading, representative, error } = props.representative;
  let content;
  if (loading) {
    content = <va-loading-indicator message="Loading your representative" />;
  } else if (error) {
    content = (
      <va-alert status="error">
        <h2 slot="headline" className="vads-u-font-size--h3">
          We’re sorry. Something went wrong on our end
        </h2>
        <p className="vads-u-font-size--base">
          Please refresh this page or check back later. You can also sign out of
          VA.gov and try signing back into this page.{' '}
        </p>
        <p className="vads-u-font-size--base">
          If you get this error again, please call the VA.gov help desk at{' '}
          <Telephone contact={CONTACTS.VA_311} /> (TTY:
          <Telephone contact={CONTACTS['711']} pattern={PATTERNS['3_DIGIT']} />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </va-alert>
    );
  } else {
    content = (
      <ViewRepresentativeDetails
        {...representative.data}
        searchRepresentative={props.searchRepresentative}
      />
    );
  }
  return content;
};

export default ViewRepresentativeBody;
