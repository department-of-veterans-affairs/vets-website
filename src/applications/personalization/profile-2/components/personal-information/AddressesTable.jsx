import React from 'react';
import { connect } from 'react-redux';

import { selectVet360Field } from 'platform/user/profile/vet360/selectors';

import AddressView from 'platform/user/profile/vet360/components/AddressField/AddressView';
import { FIELD_NAMES } from 'platform/user/profile/vet360/constants';
import prefixUtilityClasses from 'platform/utilities/prefix-utility-classes';

import ProfileInfoTable from '../ProfileInfoTable';

const ContactInfoCell = props => {
  const { value } = props;

  const wrapperClasses = prefixUtilityClasses(
    [
      'display--flex',
      'align-items--flex-start',
      'flex-direction--row',
      'justify-content--space-between',
    ],
    'medium',
  );

  const editButtonClasses = [
    'va-button-link',
    ...prefixUtilityClasses(['margin-top--1p5']),
  ];

  const editButtonClassesMedium = prefixUtilityClasses(
    ['flex--auto', 'margin-top--0'],
    'medium',
  );

  const classes = {
    wrapper: [...wrapperClasses].join(' '),
    editButton: [...editButtonClasses, ...editButtonClassesMedium].join(' '),
  };
  const contactInfo = value ? <AddressView data={value} /> : 'not set';
  return (
    <div className={classes.wrapper}>
      {contactInfo}
      <button className={classes.editButton}>Edit</button>
    </div>
  );
};

const AddressesTable = ({ className, homeAddress, mailingAddress }) => (
  <ProfileInfoTable
    title="Addresses"
    data={[
      {
        title: 'Mailing address',
        value: <ContactInfoCell value={mailingAddress} />,
      },
      {
        title: 'Home address',
        value: <ContactInfoCell value={homeAddress} />,
      },
    ]}
    className={className}
    list
  />
);

const mapStateToProps = state => ({
  homeAddress: selectVet360Field(state, FIELD_NAMES.RESIDENTIAL_ADDRESS),
  mailingAddress: selectVet360Field(state, FIELD_NAMES.MAILING_ADDRESS),
});

export default connect(mapStateToProps)(AddressesTable);
