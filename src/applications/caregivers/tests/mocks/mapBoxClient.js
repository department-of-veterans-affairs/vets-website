// Mock MapBox client for testing purposes
export const mockMapBoxClient = (
  longitude1 = null,
  latitude1 = null,
  longitude2 = null,
  latitude2 = null,
) => ({
  forwardGeocode() {
    return Object.create({
      send() {
        return new Promise((resolve, reject) => {
          resolve({
            body: {
              features: [
                {
                  bbox: [longitude1, latitude1, longitude2, latitude2],
                },
              ],
            },
          });

          reject(new Error('Some bad error occurred.'));
        });
      },
    });
  },
});
