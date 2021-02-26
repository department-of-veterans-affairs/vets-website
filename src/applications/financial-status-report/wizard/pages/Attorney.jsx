import React from 'react';
import { pageNames } from '../constants';
import ContactBenefits from '../components/ContactBenefits';

const Attorney = () => <ContactBenefits />;

export default {
  name: pageNames.attorney,
  component: Attorney,
};
