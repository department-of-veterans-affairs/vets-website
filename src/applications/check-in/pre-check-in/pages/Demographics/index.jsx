import React from 'react';
import BackToHome from '../../components/BackToHome';
import FormButtons from '../../components/FormButtons';

export default function index({ router }) {
  return (
    <>
      <h1>Demographics</h1>
      <FormButtons router={router} />
      <BackToHome />
    </>
  );
}
