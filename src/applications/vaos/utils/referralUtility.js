import { getProviderServiceSlotById } from '../services/referral';

export const sortOptions = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating' },
  { value: 'availability', label: 'Availability' },
  { value: 'name', label: 'Name' },
];

export const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const processProviderServices = providerServices => {
  return providerServices.data.providerServices.map(item => {
    return {
      providerName: item.name,
      address: item.location.address,
      distance: '42 miles',
      nextAvailable: null,
      providerId: item.id,
      providerOrganization: item.providerOrganization.name,
      slots: [],
      firstAvailable: null,
    };
  });
};

export const fetchAndProcessProviderSlots = async provider => {
  const newProvider = { ...provider };
  const providerSlots = await getProviderServiceSlotById(provider.providerId);
  newProvider.slots = providerSlots.data;

  const sortedSlots = newProvider.slots.sort(
    (a, b) => new Date(a.start) - new Date(b.start),
  );
  newProvider.firstAvailable =
    sortedSlots.length > 0
      ? formatDate(sortedSlots[0].start)
      : 'No dates available';
  newProvider.nextAvailable =
    sortedSlots.length > 1
      ? formatDate(sortedSlots[1].start)
      : 'No dates available';

  return newProvider;
};
