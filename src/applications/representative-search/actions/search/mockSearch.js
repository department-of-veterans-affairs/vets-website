import { MOCK_SEARCH } from '../../utils/actionTypes';

/**
 * Sync form state with Redux state.
 * (And implicitly cause updates back in VAMap)
 *
 * @param {Object} query The current state of the Search form
 */

export const mockSearch = () => {
  return {
    type: MOCK_SEARCH,

    payload: {
      pagination: {
        totalEntries: 15,
        totalPages: 2,
        currentPage: 1,
      },
      searchResults: [
        {
          id: '123',
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          distance: 1.25,
          organization: 'Catholic War Veterans of the USA (081)',
          type: 'VSO',
          addressLine1: '237-20 92nd Road',
          addressLine2: 'Bellerose, NY 11426',
          phone: '(702) 684-2997',
        },
        {
          id: '1234',
          distance: 1.55,
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          organization: 'Polish Legion of American Veterans (003)',
          type: 'VSO',
          addressLine1: '237-20 92nd Road',
          addressLine2: 'Bellerose, NY 11426',
          phone: '(703) 549-3622',
        },
        {
          id: '1235',
          distance: 1.65,
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          organization:
            'National Association of County Veterans Service Of (064)',
          type: 'VSO',
          addressLine1: 'Union County Services',
          addressLine2: 'Elizabeth, NJ 07207',
          phone: '(856) 780-1380',
        },
        {
          id: '1236',
          distance: 1.75,
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          organization: 'Jewish War Veterans of the USA (086)',
          type: 'VSO',
          addressLine1: '237-20 92nd Road',
          addressLine2: 'Bellerose, NY 11426',
          phone: '(377) 777-8157',
        },
        {
          id: '127',
          distance: 2.05,
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          organization: 'Vietnam Veterans of America (070)',
          type: 'VSO',
          addressLine1: '616 E. Landis Ave.',
          addressLine2: 'Vineland, NJ 08360',
          phone: '(856) 293-7321',
        },
        {
          id: '128',
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          distance: 1.25,
          organization: 'Catholic War Veterans of the USA (081)',
          type: 'VSO',
          addressLine1: '237-20 92nd Road',
          addressLine2: 'Bellerose, NY 11426',
          phone: '(702) 684-2997',
        },
        {
          id: '129',
          distance: 1.55,
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          organization: 'Polish Legion of American Veterans (003)',
          type: 'VSO',
          addressLine1: '237-20 92nd Road',
          addressLine2: 'Bellerose, NY 11426',
          phone: '(703) 549-3622',
        },
        {
          id: '12333',
          distance: 1.65,
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          organization:
            'National Association of County Veterans Service Of (064)',
          type: 'VSO',
          addressLine1: 'Union County Services',
          addressLine2: 'Elizabeth, NJ 07207',
          phone: '(856) 780-1380',
        },
        {
          id: '12443',
          distance: 1.75,
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          organization: 'Jewish War Veterans of the USA (086)',
          type: 'VSO',
          addressLine1: '237-20 92nd Road',
          addressLine2: 'Bellerose, NY 11426',
          phone: '(377) 777-8157',
        },
        {
          id: '15423',
          distance: 2.05,
          attributes: {
            address: {
              physical: {
                zip: '11426',
                city: 'Bellerose',
                state: 'NY',
                address1: '237-20 92nd Road',
                address2: null,
              },
            },
            name: 'Catholic War Veterans of the USA (081)',
          },
          organization: 'Vietnam Veterans of America (070)',
          type: 'VSO',
          addressLine1: '616 E. Landis Ave.',
          addressLine2: 'Vineland, NJ 08360',
          phone: '(856) 293-7321',
        },
      ],
    },
  };
};
