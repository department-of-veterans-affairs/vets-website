import React from 'react';
import { shallow } from 'enzyme';
import IntroductionPage from '../../containers/IntroductionPage';

describe("<IntroductionPage />", () => {
    it('should be defined', () => {
        const wrapper = shallow(<IntroductionPage />);

        expect(wrapper).toBeDefined();
    })
})
