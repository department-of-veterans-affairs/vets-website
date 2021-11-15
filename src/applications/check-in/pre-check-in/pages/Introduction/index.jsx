import React from 'react';
import BackToHome from '../../components/BackToHome';
import FormButtons from '../../components/FormButtons';

export default function index(props) {
  const { router } = props;
  return (
    <>
      <h1>Introduction</h1>
      <FormButtons router={router} />
      <BackToHome />
    </>
  );
}
