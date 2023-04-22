#!/bin/sh

if [ -z "$DEBUG" ]; then
    echo "Need to set \$DEBUG"
    exit 1
fi

if [ "$DEBUG" = 1 ]; then
    export NODE_ENV=development
    npm install --save-dev nodemon
    npm run dev
else
    export NODE_ENV=production
    npm start
fi
