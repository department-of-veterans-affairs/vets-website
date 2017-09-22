import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import AddressBlock from '../../../src/js/letters/components/AddressBlock';

const defaultProps = { name: 'Gary Todd' };

describe('<AddressBlock/>', () => {
    it('should render', () => {
        const tree = SkinDeep.shallowRender(<AddressBlock { ...defaultProps }/>);
        const vdom = tree.getRenderOutput();
        expect(vdom).to.exist;
    });
});
