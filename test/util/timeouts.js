module.exports = {
  normal: 500,     // The normal timeout to use. For most opreations w/o a server roundtrip, this should be more than fast enough.
  slow: 1000,      // A slow timeout incase the page is doing something complex.
  molasses: 5000,  // A really really slow timeout. This should rarely be used.
  submission: 10000 // Only to be used for submission.
};
