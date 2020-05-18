import React from 'react';
import { pageNames } from './pageList';

const InvalidSeparationDatePage = () => (
  <p>A separation date must occur in the future.</p>
);

export default {
  name: pageNames.invalidSeparationDate,
  component: InvalidSeparationDatePage,
};
