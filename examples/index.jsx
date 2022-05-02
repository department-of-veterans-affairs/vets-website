import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Route, Outlet } from 'react-router-dom';
import { FormRouter } from '@department-of-veterans-affairs/va-forms-system-core';
import FormApp from './multi-page';

import '@department-of-veterans-affairs/component-library/dist/main.css';
import { defineCustomElements } from '@department-of-veterans-affairs/component-library';
void defineCustomElements();

const initialValues = {
  firstName: '', 
  lastName: '', 
  email: '', 
  street: '', 
  streetTwo: '', 
  streetThree: '', 
  state: '', 
  zipcode: ''
};

const Main = () => {

  return (
  <FormApp basename="/" initialValues={ initialValues }
  />)
}

ReactDOM.render(<Main />, document.getElementById('root'));
