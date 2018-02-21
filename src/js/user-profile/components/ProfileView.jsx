import moment from '../../common/utils/moment-setup';
import React from 'react';
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

  openModalHandler(modalName) {
    return () => this.setState({ modal: modalName });
  }

  render() {
    if (!this.props.profile.extended) {
      return <LoadingIndicator message="Loading complete profile..."/>;
    }

    const {
      email,
      userFullName,
      ssn,
      dob,
      gender,
      telephones,
      addresses,
      toursOfDuty: toursOfDutyUnsorted
    } = this.props.profile;

    const residentialAddress = addresses.find(a => a.type === 'residential');
    const mailingAddress = addresses.find(a => a.type === 'mailing');
    const primaryPhone = telephones.find(t => t.type === 'primary');
    const alternatePhone = telephones.find(t => t.type === 'alternate');
    const toursOfDuty = toursOfDutyUnsorted.sort((tour, tour2) => {
      return moment(tour.dateRange.end).isBefore(tour2.dateRange.end) ? 1 : -1;
    });
    const latestTour = toursOfDuty[0];

    const modal = (() => {
      const onClose = this.openModalHandler(null);
      switch (this.state.modal) {
        case 'mailingAddress':
          return (<EditAddressModal
            title="Edit mailing address"
            address={mailingAddress}
            onClose={onClose}/>);

        case 'residentialAddress':
          return (<EditAddressModal
            title="Edit residential address"
            address={residentialAddress}
            onClose={onClose}/>);

        case 'primaryPhone':
          return (<EditPhoneModal
            title="Edit primary phone"
            value={primaryPhone.value}
            onClose={onClose}/>);

        case 'altPhone':
          return (<EditPhoneModal
            title="Edit alternate phone"
            value={alternatePhone.value}
            onClose={onClose}/>);

        case 'email':
          return (<EditEmailModal
            title="Edit email"
            value={email}
            onClose={onClose}/>);

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
              <img alt="You" style={{ height: '8em' }} src="/img/photo-placeholder.png"/>
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
        {primaryPhone.value}
        <HeadingWithEdit onEditClick={this.openModalHandler('altPhone')}>Alternate Phone Number</HeadingWithEdit>
        {alternatePhone.value}
        <HeadingWithEdit onEditClick={this.openModalHandler('email')}>Email Address</HeadingWithEdit>
        {email}
        <h2>Personal Information</h2>
        <h3>Gender</h3>
        {gender}
        <h3>Birth date</h3>
        {moment(dob).format('LL')}
        <h3>Social security number</h3>
        {ssn}
        <h2>Military Service</h2>
        {toursOfDuty.map((tour, index) => {
          return (
            <div key={index}>
              <h3>{tour.serviceBranch}</h3>
              <div>{moment(tour.dateRange.start).format('LL')} - {moment(tour.dateRange.end).format('LL')}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ProfileView;
