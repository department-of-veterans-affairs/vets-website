import { reportGeneratedBy } from '@department-of-veterans-affairs/mhv/exports';
import { dateFormat } from './helpers';
import { rxListSortingOptions } from './constants';

export function buildPdfData({
  userName,
  dob,
  selectedSortOption,
  rxList,
  allergiesList,
}) {
  return {
    subject: 'Full Medications List',
    headerBanner: [
      {
        text:
          'If you’re ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at ',
      },
      { text: '988', weight: 'bold' },
      { text: '. Then select 1.' },
    ],
    headerLeft: userName.first
      ? `${userName.last}, ${userName.first}`
      : `${userName.last || ' '}`,
    headerRight: `Date of birth: ${dateFormat(dob, 'MMMM D, YYYY')}`,
    footerLeft: reportGeneratedBy,
    footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
    title: 'Medications',
    preface: [
      {
        value: `This is a list of prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.`,
      },
    ],
    results: [
      {
        header: 'Medications list',
        preface: `Showing ${rxList?.length} medications, ${rxListSortingOptions[
          selectedSortOption
        ].LABEL.toLowerCase()}`,
        list: rxList,
      },
      {
        header: 'Allergies',
        ...(allergiesList &&
          allergiesList.length > 0 && {
            preface: [
              {
                value:
                  'This list includes all allergies, reactions, and side effects in your VA medical records. This includes medication side effects (also called adverse drug reactions). If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.',
              },
              {
                value: `Showing ${
                  allergiesList.length
                } records from newest to oldest`,
              },
            ],
          }),
        list: allergiesList || [],
        ...(allergiesList &&
          !allergiesList.length && {
            preface:
              'There are no allergies or reactions in your VA medical records. If you have allergies or reactions that are missing from your records, tell your care team at your next appointment.',
          }),
        ...(!allergiesList && {
          preface: [
            {
              value:
                'We couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later.',
            },
            {
              value:
                'If it still doesn’t work, call us at 877-327-0022 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
            },
          ],
        }),
      },
    ],
  };
}
