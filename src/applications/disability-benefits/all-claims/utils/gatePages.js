export const gatePages = (pages, predicate) =>
  Object.fromEntries(
    Object.entries(pages).map(([key, page]) => {
      const prev = page.depends || (() => true);
      return [
        key,
        {
          ...page,
          depends: (fd, ...rest) => predicate(fd, ...rest) && prev(fd, ...rest),
        },
      ];
    }),
  );
