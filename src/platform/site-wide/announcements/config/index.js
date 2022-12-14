import HomepagRedesignModal from '../components/HomepageRedesignModal';

const config = {
  announcements: [
    {
      name: 'new-homepage',
      // Homepage only
      paths: /^\/$/,
      component: HomepagRedesignModal,
      disabled: false,
      showEverytime: true,
    },
  ],
};

export default config;
