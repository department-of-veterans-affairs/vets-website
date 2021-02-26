import React from 'react';
import { pageNames } from '../constants';
import SeparationAttorney from '../components/SeparationAttorney';

const Attorney = () => <SeparationAttorney />;

export default {
  name: pageNames.attorney,
  component: Attorney,
};
