module.exports = {
  normal: 2000,     // The normal timeout to use. For most opreations w/o a server roundtrip, this should be more than fast enough.
  slow: 5000      // A slow timeout incase the page is doing something complex.
};
