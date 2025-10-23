export default async function retryOnce(retryableFunction) {
  try {
    return await retryableFunction();
  } catch (error) {
    return retryableFunction();
  }
}
