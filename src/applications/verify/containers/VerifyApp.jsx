import React, { useEffect } from 'react';
import Verify from '../components/UnifiedVerify';

export default function VerifyApp() {
  useEffect(() => {
    document.title = `Verify your identity`; // Set the document title
  }, []);

  return <Verify />;
}
