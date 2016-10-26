#!/bin/sh
# via http://stackoverflow.com/questions/1964470

if [ "$(uname)" = 'Darwin' ] ||
   [ "$(uname)" = 'FreeBSD' ]; then
   gittouch() {
      touch -ch -t "$(date -r "$(git log -1 --format=%ct "$1")" '+%Y%m%d%H%M.%S')" "$1"
   }
else
   gittouch() {
      touch -ch -d "$(git log -1 --format=%ci "$1")" "$1"
   }
fi

git ls-files |
   while IFS= read -r file; do
      gittouch "$file"
   done
