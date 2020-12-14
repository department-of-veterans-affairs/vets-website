import React from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
import { ViewRepresentativeDetails } from './ViewRepresentativeDetails';

const ViewRepresentativeBody = props => {
  const { loading, representative, error } = props.representative;
  let content;
  if (loading) {
    content = <LoadingIndicator message="Loading your representative" />;
  } else if (error) {
    content = (
      <AlertBox
        headline="We’re sorry. Something went wrong on our end"
        content={
          <>
            <p>
              Please refresh this page or check back later. You can also sign
              out of VA.gov and try signing back into this page.{' '}
            </p>
            <p>
              If you get this error again, please call the VA.gov help desk at{' '}
              <Telephone contact={CONTACTS.VA_311} /> (TTY:
              <Telephone
                contact={CONTACTS['711']}
                pattern={PATTERNS['3_DIGIT']}
              />
              ). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. ET.
            </p>
          </>
        }
        status={ALERT_TYPE.ERROR}
      />
    );
  } else {
    content = <ViewRepresentativeDetails {...representative.data} />;
  }
  return content;
};

export default ViewRepresentativeBody;
