export const formatPromoBannerType = type => {
  switch (type) {
    case 'announcements': {
      return 'announcement';
    }
    case 'email-signup': {
      return 'email-signup';
    }
    case 'news-stories': {
      return 'news';
    }
    default: {
      return 'announcement';
    }
  }
};
