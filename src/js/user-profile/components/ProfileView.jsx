import React from 'react';
import moment from '../../common/utils/moment-setup';
import {
  SAVE_MAILING_ADDRESS,
  SAVE_RESIDENTIAL_ADDRESS,
  SAVE_PRIMARY_PHONE,
  SAVE_ALTERNATE_PHONE,
  SAVE_EMAIL_ADDRESS,
  FETCH_EXTENDED_PROFILE_FAIL
} from '../actions';

import AlertBox from '../../common/components/AlertBox';
import PhoneNumberWidget from '../../common/schemaform/review/PhoneNumberWidget';
import SSNWidget from '../../common/schemaform/review/SSNWidget';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import { EditAddressModal, EditPhoneModal, EditEmailModal } from './ProfileViewModals';

function HeadingWithEdit({ children, onEditClick }) {
  return (
    <div>
      <h3 style={{ display: 'inline-block' }}>{ children }</h3> <button onClick={onEditClick} className="va-button-link">Edit</button>
    </div>
  );
}

class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modal: null };
  }

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
    } else if (this.props.profile.errors.includes(FETCH_EXTENDED_PROFILE_FAIL)) {
      return (
        <AlertBox status="error" isVisible
          content={<h4 className="usa-alert-heading">Failed to load extended profile</h4>}/>
      );
    }

    const {
      email,
      userFullName,
      profilePicture,
      ssn,
      dob,
      gender,
      telephones,
      addresses,
      toursOfDuty: toursOfDutyUnsorted
    } = this.props.profile;

    const { currentlyOpen: currentlyOpenModal, pendingSaves } = this.props.modal;
    const residentialAddress = addresses.find(a => a.type === 'residential');
    const mailingAddress = addresses.find(a => a.type === 'mailing');
    const primaryPhone = telephones.find(t => t.type === 'primary');
    const alternatePhone = telephones.find(t => t.type === 'alternate');
    const toursOfDuty = toursOfDutyUnsorted.sort((tour, tour2) => {
      return moment(tour.dateRange.end).isBefore(tour2.dateRange.end) ? 1 : -1;
    });
    const latestTour = toursOfDuty[0];

    const modal = (() => {
      switch (currentlyOpenModal) {
        case 'mailingAddress':
          return (<EditAddressModal
            title="Edit mailing address"
            address={mailingAddress}
            onSubmit={this.props.updateActions.updateMailingAddress}
            isLoading={pendingSaves.includes(SAVE_MAILING_ADDRESS)}
            onClose={this.closeModal}/>);

        case 'residentialAddress':
          return (<EditAddressModal
            title="Edit residential address"
            address={residentialAddress}
            onSubmit={this.props.updateActions.updateResidentialAddress}
            isLoading={pendingSaves.includes(SAVE_RESIDENTIAL_ADDRESS)}
            onClose={this.closeModal}/>);

        case 'primaryPhone':
          return (<EditPhoneModal
            title="Edit primary phone"
            phone={primaryPhone}
            onSubmit={this.props.updateActions.updatePrimaryPhone}
            isLoading={pendingSaves.includes(SAVE_PRIMARY_PHONE)}
            onClose={this.closeModal}/>);

        case 'altPhone':
          return (<EditPhoneModal
            title="Edit alternate phone"
            phone={alternatePhone}
            onSubmit={this.props.updateActions.updateAlternatePhone}
            isLoading={pendingSaves.includes(SAVE_ALTERNATE_PHONE)}
            onClose={this.closeModal}/>);

        case 'email':
          return (<EditEmailModal
            title="Edit email"
            value={email}
            onSubmit={this.props.updateActions.updateEmailAddress}
            isLoading={pendingSaves.includes(SAVE_EMAIL_ADDRESS)}
            onClose={this.closeModal}/>);

        default:
          return null;
      }
    })();

    return (
      <div>
        {modal}
        <div className="profile-hero" style={{ display: 'flex' }}>
          <div>
            <div>
              <img alt="You" style={{ height: '8em' }} src={profilePicture}/>
            </div>
          </div>
          <div style={{ marginLeft: 25 }}>
            <h2 style={{ marginTop: 0 }}>{userFullName.first} {userFullName.last}</h2>
            United States {latestTour.serviceBranch}<br/>
            {latestTour.rank}
          </div>
        </div>
        <h2>Contact Information</h2>
        <HeadingWithEdit onEditClick={this.openModalHandler('mailingAddress')}>Mailing Address</HeadingWithEdit>
        {mailingAddress.addressOne}<br/>
        {mailingAddress.city}, {mailingAddress.stateCode} {mailingAddress.zipCode}
        <HeadingWithEdit onEditClick={this.openModalHandler('residentialAddress')}>Residential Address</HeadingWithEdit>
        {residentialAddress.addressOne}<br/>
        {residentialAddress.city}, {residentialAddress.stateCode} {residentialAddress.zipCode}
        <HeadingWithEdit onEditClick={this.openModalHandler('primaryPhone')}>Primary Phone Number</HeadingWithEdit>
        <PhoneNumberWidget value={primaryPhone.value}/>
        <HeadingWithEdit onEditClick={this.openModalHandler('altPhone')}>Alternate Phone Number</HeadingWithEdit>
        <PhoneNumberWidget value={alternatePhone.value}/>
        <HeadingWithEdit onEditClick={this.openModalHandler('email')}>Email Address</HeadingWithEdit>
        {email}
        <h2>Personal Information</h2>
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
}

export default ProfileView;
