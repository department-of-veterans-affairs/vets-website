export default function keepAlive() {
  return Promise.resolve({ ttl: 0 });
}

export { keepAlive };
