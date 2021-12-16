import {
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';

const contactInfoSelectorByChannelType = {
  1: selectVAPMobilePhone,
  2: selectVAPEmailAddress,
};

export const getContactInfoSelectorByChannelType = channelType => {
  return contactInfoSelectorByChannelType[channelType];
};
