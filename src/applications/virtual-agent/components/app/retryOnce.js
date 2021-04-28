export default async function retryOnce(retryableFunction) {
  try {
    return await retryableFunction();
  } catch (error) {
    // eslint-disable-next-line no-return-await
    return await retryableFunction();
  }
}
