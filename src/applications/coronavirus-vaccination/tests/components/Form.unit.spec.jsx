import React from 'react';
import ReactDOM from 'react-dom';

import { Form } from '../../components/Form';

describe('<Form/>', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Form
        formState={null}
        updateFormData={() => {}}
        router={{}}
        isLoggedIn={false}
        profile={{}}
      />,
      div,
    );
  });
});
