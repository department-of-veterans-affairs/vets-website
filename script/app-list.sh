find src/ -name manifest.js* | xargs grep "entryName" | sed -E 's/.+:(.+)/\1/' | sed "s/['\", ]//g" | sort
