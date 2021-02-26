import React from 'react';
import { pageNames } from '../constants';
import ContactDMC from '../components/ContactDMC';

const WrongDebt = () => <ContactDMC />;

export default {
  name: pageNames.wrong,
  component: WrongDebt,
};
