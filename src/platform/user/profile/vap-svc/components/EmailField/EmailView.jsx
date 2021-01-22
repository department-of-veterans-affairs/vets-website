import React from 'react';

export default function EmailView({ data: emailData }) {
  return <span>{emailData.emailAddress}</span>;
}
