import React from 'react';
import BackToHome from '../../components/BackToHome';
import FormButtons from '../../components/FormButtons';

export default function index({ router }) {
  return (
    <>
      <h1>Prepare for your primary care appointment</h1>
      <FormButtons router={router} />
      <BackToHome />
    </>
  );
}
