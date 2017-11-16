import React from 'react';
import { shallow, render } from 'enzyme';
import { expect } from 'chai';

import CurrentStatus from '../../../../src/js/claims-status/components/appeals-v2/CurrentStatus';

const defaultProps = {
  title: '',
  description: ''
};

describe('<CurrentStatus/>', () => {
  it('should render', () => {
    const wrapper = shallow(<CurrentStatus {...defaultProps}/>);
    expect(wrapper.type()).to.equal('li');
  });

  it('should render title and description from passed in props', () => {
    const props = {
      title: 'The Chicago Regional Office is reviewing your appeal',
      description: `The Chicago Regional Office received your Notice of Disagreement and is 
      revewing your appeal. This means they review all of the evidence related to your appeal, 
      including any new evidence you submit. They may contact you to request additional evidence 
      or medical examinations, as needed. When they have completed their review, they will 
      determine whether or not they can grant your appeal.`
    };
    const wrapper = render(<CurrentStatus {...props}/>);
    const statusTitle = wrapper.find('h4').text();
    const statusDescription = wrapper.find('p').text();
    expect(statusTitle).to.equal(props.title);
    expect(statusDescription).to.equal(props.description);
  });
});
