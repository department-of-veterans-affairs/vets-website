#! usr/bin/env bash

# From this SO answer:
#   https://stackoverflow.com/a/12179492
diff-lines() {
  local path=
  local line=
  while read; do
	  esc=$'\033'
	  if [[ $REPLY =~ ---\ (a/)?.* ]]; then
		  continue
	  elif [[ $REPLY =~ \+\+\+\ (b/)?([^[:blank:]$esc]+).* ]]; then
		  path=${BASH_REMATCH[2]}
	  elif [[ $REPLY =~ @@\ -[0-9]+(,[0-9]+)?\ \+([0-9]+)(,[0-9]+)?\ @@.* ]]; then
		  line=1
	  elif [[ $REPLY =~ ^($esc\[[0-9;]+m)*([\ +-]) ]]; then
		  echo "$path:$line:$REPLY"
		  if [[ ${BASH_REMATCH[2]} != - ]]; then
			 ((line++))
		  fi
	  fi
  done
}

diff-lines
