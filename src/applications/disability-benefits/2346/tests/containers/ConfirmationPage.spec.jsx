import React from 'react';
import { shallow } from 'enzyme';
import ConfirmationPage from '../../containers/ConfirmationPage';

describe("<ConfirmationPage />", () => {
    it('should be defined', () => {
        const wrapper = shallow(<ConfirmationPage />);

        expect(wrapper).toBeDefined();
    })
})
