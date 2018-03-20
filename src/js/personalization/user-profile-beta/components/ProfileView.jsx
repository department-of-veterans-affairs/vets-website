import React from 'react';
import moment from '../../../common/utils/moment-setup';
import {
  SAVE_MAILING_ADDRESS,
  SAVE_RESIDENTIAL_ADDRESS,
  SAVE_PRIMARY_PHONE,
  SAVE_ALTERNATE_PHONE,
  SAVE_EMAIL_ADDRESS,
  FETCH_EXTENDED_PROFILE_FAIL
} from '../actions';

import AlertBox from '../../../common/components/AlertBox';
import PhoneNumberWidget from '../../../common/schemaform/review/PhoneNumberWidget';
import SSNWidget from '../../../common/schemaform/review/SSNWidget';
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import { EditAddressModal, EditPhoneModal, EditEmailModal } from './ProfileViewModals';
import HeadingWithEdit from './HeadingWithEdit';

function Hero({ userFullName, tour, profilePicture }) {
  return (
    <div className="profile-hero" style={{ display: 'flex' }}>
      <div>
        <div>
          <img alt="You" style={{ height: '8em' }} src={profilePicture}/>
        </div>
      </div>
      <div style={{ marginLeft: 25 }}>
        <h2 style={{ marginTop: 0 }}>{userFullName.first} {userFullName.last}</h2>
        United States {tour.serviceBranch}<br/>
        {tour.rank}
      </div>
    </div>
  );
}

function EmailSection({ emailResponseData, title, isEditing, isLoading, onEdit, onCancel, onSubmit }) {
  let emailDisplay = <em>N/A</em>;
  let modal = null;

  if (emailResponseData) {
    emailDisplay = emailResponseData.email;
  }

  if (isEditing) {
    modal = (
      <EditEmailModal
        title="Edit email"
        value={emailResponseData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={onEdit}>{title}</HeadingWithEdit>
      <div>{emailDisplay}</div>
    </div>
  );
}

function PhoneSection({ phoneResponseData, title, isEditing, isLoading, onEdit, onCancel, onSubmit }) {
  let phoneDisplay = <em>N/A</em>;
  let modal = null;

  if (phoneResponseData) {
    phoneDisplay = <PhoneNumberWidget value={phoneResponseData.number}/>;
  }

  if (isEditing) {
    modal = (
      <EditPhoneModal
        title="Edit alternate phone"
        phoneResponseData={phoneResponseData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={onEdit}>{title}</HeadingWithEdit>
      {phoneDisplay}
    </div>
  );
}

function AddressSection({ addressResponseData, title, isEditing, isLoading, onEdit, onCancel, onSubmit }) {
  let addressDisplay = <em>N/A</em>;
  let modal = null;

  if (addressResponseData) {
    let { address } = addressResponseData;
    addressDisplay = (
      <div>{address.addressOne}<br/>
        {address.addressTwo}, {address.militaryStateCode} {address.zipCode}
      </div>
    );
  }

  if (isEditing) {
    modal = (
      <EditAddressModal
        title="Edit mailing address"
        address={addressResponseData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={onEdit}>{title}</HeadingWithEdit>
      {addressDisplay}
    </div>
  );
}

function PersonalInformation({ gender, dob, ssn, toursOfDuty }) {
  return (
    <div>
        <h3>Gender</h3>
        {gender === 'M' ? 'Male' : 'Female'}
        <h3>Birth date</h3>
        {moment(dob).format('MMM D, YYYY')}
        <h3>Social security number</h3>
        <SSNWidget value={ssn}/>
        <h2>Military Service</h2>
        {toursOfDuty.map((tour, index) => {
          return (
            <div key={index}>
              <h3>{tour.serviceBranch}</h3>
              <div>{moment(tour.dateRange.start).format('MMM D, YYYY')} &ndash; {moment(tour.dateRange.end).format('MMM D, YYYY')}</div>
            </div>
          );
        })}
    </div>
  );
}

class ProfileView extends React.Component {

  componentWillMount() {
    this.props.fetchExtendedProfile();
  }

  componentDidUpdate(newProps) {
    if (newProps.profile.email !== this.props.profile.email) {
      this.closeModal();
    }
  }

  openModalHandler(modalName) {
    return () => this.props.modal.open(modalName);
  }

  closeModal = () => {
    this.openModalHandler(null)();
  }

  render() {
    if (!this.props.profile.extended) {
      return <LoadingIndicator message="Loading complete profile..."/>;
    }

    if (this.props.profile.errors.includes(FETCH_EXTENDED_PROFILE_FAIL)) {
      return (
        <AlertBox status="error" isVisible
          content={<h4 className="usa-alert-heading">Failed to load extended profile</h4>}/>
      );
    }

    const {
      currentlyOpen: currentlyOpenModal,
      pendingSaves
    } = this.props.modal;

    const {
      email,
      userFullName,
      profilePicture,
      mailingAddress,
      primaryTelephone,
      alternateTelephone,
      ssn,
      dob,
      gender,
      toursOfDuty
    } = this.props.profile;

    return (
      <div>
        <Hero userFullName={userFullName} tour={toursOfDuty[0]} profilePicture={profilePicture}/>

        <h2>Contact Information</h2>

        <AddressSection
          title="Mailing Address"
          addressResponseData={mailingAddress}
          isEditing={currentlyOpenModal === 'mailingAddress'}
          isLoading={pendingSaves.includes(SAVE_MAILING_ADDRESS)}
          onEdit={this.openModalHandler('mailingAddress')}
          onSubmit={this.props.updateActions.updateMailingAddress}
          onCancel={this.closeModal}/>

        <PhoneSection
          title="Primary Phone"
          phoneResponseData={primaryTelephone}
          isEditing={currentlyOpenModal === 'primaryPhone'}
          isLoading={pendingSaves.includes(SAVE_PRIMARY_PHONE)}
          onEdit={this.openModalHandler('primaryPhone')}
          onSubmit={this.props.updateActions.updatePrimaryPhone}
          onCancel={this.closeModal}/>

        <PhoneSection
          title="Alternate Phone"
          phoneResponseData={alternateTelephone}
          isEditing={currentlyOpenModal === 'altPhone'}
          isLoading={pendingSaves.includes(SAVE_ALTERNATE_PHONE)}
          onEdit={this.openModalHandler('altPhone')}
          onSubmit={this.props.updateActions.updateAlternatePhone}
          onCancel={this.closeModal}/>

        <EmailSection
          title="Email Address"
          emailResponseData={email}
          isEditing={currentlyOpenModal === 'email'}
          isLoading={pendingSaves.includes(SAVE_EMAIL_ADDRESS)}
          onEdit={this.openModalHandler('email')}
          onSubmit={this.props.updateActions.updateEmailAddress}
          onCancel={this.closeModal}/>

        <h2>Personal Information</h2>
        <PersonalInformation gender={gender} dob={dob} ssn={ssn} toursOfDuty={toursOfDuty}/>
      </div>
    );
  }
}

export default ProfileView;
