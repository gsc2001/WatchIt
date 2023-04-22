#!/bin/sh

export NODE_ENV=production
npm run build
PORT=3000 npx serve -s build
