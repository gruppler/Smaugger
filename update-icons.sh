#!/bin/bash

unzip -o icomoon.zip -d icomoon && cp -r icomoon/fonts app/css/icons/ && cp icomoon/style.css app/css/icons/ && rm -rf icomoon.zip icomoon
