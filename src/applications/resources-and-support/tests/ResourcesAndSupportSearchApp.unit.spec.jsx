import React from 'react';
import ReactDOM from 'react-dom';
import ResourcesAndSupportSearchApp from '../components/ResourcesAndSupportSearchApp';

describe('ResourcesAndSupportSearchApp', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResourcesAndSupportSearchApp />, div);
  });
});
