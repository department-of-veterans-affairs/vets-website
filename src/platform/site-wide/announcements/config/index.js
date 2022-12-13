import HomepagRedesignModal from '../components/HomepageRedesignModal';

const config = {
  announcements: [
    {
      name: 'new-homepage',
      // All pages.
      paths: /^\/$/,
      component: HomepagRedesignModal,
      disabled: HomepagRedesignModal.isEnabled(),
      showEverytime: true,
    },
  ],
};

export default config;
