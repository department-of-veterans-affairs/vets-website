import React from 'react';
import ProfileCard from './ProfileCard';

const Profile = ({ onViewPersonalInformation }) => {
  const otherCards = [
    {
      title: 'Contact information',
      description: 'Addresses, phone numbers, and email address',
      linkText: 'Manage your contact information',
      linkHref: '/profile/contact-information',
    },
    {
      title: 'Personal health care contacts',
      description:
        'Medical emergency contact and next of kin contact information',
      linkText: 'Review your personal health care contacts',
      linkHref: '/profile/contacts',
    },
    {
      title: 'Military information',
      description: 'Military branches and dates of service',
      linkText: 'Review your military information',
      linkHref: '/profile/military-information',
    },
    {
      title: 'Direct deposit information',
      description:
        'Direct deposit information for disability compensation, pension, and education benefits',
      linkText: 'Manage your direct deposit information',
      linkHref: '/profile/direct-deposit',
    },
    {
      title: 'Notification settings',
      description: 'Text and email notifications you get from VA',
      linkText: 'Manage notification settings',
      linkHref: '/profile/notifications',
    },
    {
      title: 'Account security',
      description: 'Sign-in and account information',
      linkText: 'Review account security',
      linkHref: '/profile/account-security',
    },
    {
      title: 'Connected apps',
      description: '3rd-party apps that have access to your VA.gov profile',
      linkText: 'Manage connected apps',
      linkHref: '/profile/connected-applications',
    },
  ];

  return (
    <div className="vads-l-grid-container">
      <h1>Profile</h1>

      <div
        className="hub-cards"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1em',
          maxWidth: '1100px',
          width: '100%',
        }}
      >
        <ProfileCard
          title="Personal information"
          description="Legal name, date of birth, preferred name, gender identity, and disability rating"
          linkText="Manage your personal information"
          linkHref="#"
          onClick={e => {
            e.preventDefault();
            onViewPersonalInformation();
          }}
          style={{ flex: '1 1 48%' }}
        />

        {otherCards.map((card, index) => (
          <ProfileCard
            key={index}
            title={card.title}
            description={card.description}
            linkText={card.linkText}
            linkHref={card.linkHref}
            style={{ flex: '1 1 48%' }}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
