import React from 'react';
import { render } from '@testing-library/react';
import {
  emailSchema,
  emailUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import EditEmail from '../../components/EditEmail';

const title = 'Edit email address';
const props = {
  data: {
    emailAddress: 'vets.gov.user+1@gmail.com',
  },
  uiSchema: {
    ...titleUI('Edit email address'),
    'ui:objectViewField': () => {},
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      emailAddress: emailSchema,
    },
    required: ['emailAddress'],
  },
};
const setup = () => {
  return render(<EditEmail {...props} />);
};

describe('EditEmail', () => {
  it('renders', () => {
    const { getByRole } = setup();
    getByRole('heading', { level: 3, name: title });
  });
});
