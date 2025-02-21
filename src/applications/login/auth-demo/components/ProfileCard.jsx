import React from 'react';

const ProfileCard = ({
  title,
  description,
  linkText,
  linkHref,
  externalLinkText,
  externalLinkHref,
  onClick,
}) => (
  <va-card
    className="hydrated"
    style={{
      maxWidth: '400px',
      width: '100%',
      marginBottom: '1em',
      fontSize: '16px',
      lineHeight: '1.5',
      display: 'flex',
      flexDirection: 'column',
      gap: '1em',
    }}
  >
    <h2 className="vads-u-margin--0 vads-u-font-size--h3">{title}</h2>
    <p>{description}</p>
    <a
      className="sc-gsTEea hyaBQw vads-u-font-weight--bold"
      data-testid="profile-link-internal"
      href={linkHref}
      onClick={onClick}
      style={{ fontSize: '16px' }}
    >
      {linkText}
      <va-icon icon="chevron_right" size="2" className="hydrated" />
    </a>
    {externalLinkHref && (
      <a
        href={externalLinkHref}
        className="sc-dlfnuX fmQDtw vads-u-font-weight--bold"
        data-testid="profile-link-external"
        style={{ fontSize: '16px' }}
      >
        {externalLinkText}
        <va-icon icon="chevron_right" size="2" className="hydrated" />
      </a>
    )}
  </va-card>
);

export default ProfileCard;
