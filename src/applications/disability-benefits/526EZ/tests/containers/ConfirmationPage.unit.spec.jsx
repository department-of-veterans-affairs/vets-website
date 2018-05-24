import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import _ from 'lodash/fp';

import { ConfirmationPage } from '../../containers/ConfirmationPage';
import initialData from '../schema/initialData.js';

const selectedData = _.set("disabilities[0]['view:selected']", true, initialData);
describe('Disability Benefits 526EZ <ConfirmationPage>', () => {
  it('should render', () => {
    const form = {
      submission: {
        response: {
          attributes: {
            confirmationNumber: 'V-DCCI-3986'
          }
        }
      },
      data: selectedData
    };
    const tree = shallow(
      <ConfirmationPage form={form}/>
    );

    expect(tree.find('.confirmation-page-title').render().text()).to.equal('Your claim has been submitted.');
    expect(tree.find('span').at(1)
      .render()
      .text()
      .trim()
    ).to.equal('For Sally  Alphonse');
    expect(tree.find('p').at(0).render().text()).to.contain('We usually process claims within 99 days.');
    expect(tree.find('p').at(1).render().text()).to.contain('We may contact you if we have questions or need more information. You can print this page for your records.');
    expect(tree.find('.disability-list').render().text()).to.contain('Post traumatic stress disorder');
    expect(tree.find('.disability-list').render().text()).to.not.contain('Intervertebral disc syndrome');
  });

  it('should render 4142 helper text when 4142 option selected for any disability', () => {
    const newData = {
      fullName: {
        first: 'Sally',
        last: 'Alphonse'
      },
      disabilities: [
        {
          name: 'Post traumatic stress disorder',
          'view:selected': true,
          'view:uploadPrivateRecords': 'no'
        },
        {
          name: 'Intervertebral disc syndrome',
          'view:selected': true,
          'view:uploadPrivateRecords': 'yes'
        }
      ]
    };

    const newForm = {
      submission: {
        response: {
          attributes: {
            confirmationNumber: 'V-DCCI-3986'
          }
        }
      },
      data: newData
    };

    const wrapper = shallow(<ConfirmationPage form={newForm}/>);
    expect(wrapper.render().text()).to.contain(
      'you’ll need to fill out an Authorization to Disclose Information to the VA (VA Form 21-4142).'
    );
  });

  it('should not render 4142 helper text when 4142 option not selected for any disability', () => {
    const newData = {
      fullName: {
        first: 'Sally',
        last: 'Alphonse'
      },
      disabilities: [
        {
          name: 'Post traumatic stress disorder',
          'view:selected': true
        },
        {
          name: 'Intervertebral disc syndrome',
          'view:selected': true,
          'view:uploadPrivateRecords': 'yes'
        },
        {
          name: 'Third Disability',
        }
      ]
    };

    const newForm = {
      submission: {
        response: {
          attributes: {
            confirmationNumber: 'V-DCCI-3986'
          }
        }
      },
      data: newData
    };

    const wrapper = shallow(<ConfirmationPage form={newForm}/>);
    expect(wrapper.render().text()).to.not.contain(
      'you’ll need to fill out an Authorization to Disclose Information to the VA (VA Form 21-4142).'
    );
  });
});
