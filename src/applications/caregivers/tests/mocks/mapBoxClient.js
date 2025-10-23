export const mockMapBoxClient = () => ({
  forwardGeocode() {
    return Object.create({
      send() {
        return new Promise((resolve, reject) => {
          resolve({});
          reject(new Error('Some bad error occurred.'));
        });
      },
    });
  },
});
