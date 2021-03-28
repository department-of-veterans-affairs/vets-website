import React from 'react';
import { Confirmation } from '../../coronavirus-vaccination/components/Confirmation';

export default function ConfirmationPage() {
  // pass a formData prop so we don't automatically get redirected
  return <Confirmation formData={{}} />;
}
