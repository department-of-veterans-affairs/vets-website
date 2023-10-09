import { expect } from 'chai';
import { shallow } from 'enzyme';

import { CERTIFICATES_LABEL } from '../../config/constants';
import { certificatesReviewField } from '../../reviewFields';

describe('certificatesReviewField', () => {
  it('renders the label and children', async done => {
    const children = 'Test Children';

    const wrapper = shallow(certificatesReviewField({ children }));
    expect(wrapper.find('dt').text()).to.equal(CERTIFICATES_LABEL);
    expect(wrapper.find('dd').text()).to.equal(children);

    wrapper.unmount();
    done();
  });
});
