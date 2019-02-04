#!/bin/bash

nohup google-chrome \
	--no-sandbox \
	--disable-background-networking \
	--disable-default-apps \
	--disable-extensions \
	--disable-sync \
	--disable-translate \
	--headless \
	--hide-scrollbars \
	--metrics-recording-only \
	--mute-audio \
	--no-first-run \
	--safebrowsing-disable-auto-update \
	--ignore-certificate-errors \
	--ignore-ssl-errors \
	--ignore-certificate-errors-spki-list \
	--user-data-dir=/tmp \
	--remote-debugging-port=9222 \
	--remote-debugging-address=0.0.0.0