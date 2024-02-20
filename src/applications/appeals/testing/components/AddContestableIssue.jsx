import React from 'react';

import { maxNameLength } from '../../10182/validations/issues';
import { validateDate } from '../../10182/validations/date';

import AddIssue from '../../shared/components/AddIssue';

const AddContestableIssue = props => (
  <AddIssue
    {...props}
    validations={{ maxNameLength, validateDate }}
    description={null}
  />
);

export default AddContestableIssue;
