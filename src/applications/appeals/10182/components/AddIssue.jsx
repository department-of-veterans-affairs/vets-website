import React from 'react';

import { maxNameLength } from '../validations/issues';
import { validateDate } from '../validations/date';

import AddIssue from '../../shared/components/AddIssue';

const AddContestableIssue = props => (
  <AddIssue
    {...props}
    validations={{ maxNameLength, validateDate }}
    description={null}
  />
);

export default AddContestableIssue;
