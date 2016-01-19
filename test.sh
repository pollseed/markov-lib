#!/bin/bash

readonly PORT=3000
readonly HTTP_STATUS='%{http_code}\n'
readonly SUCCESS=200

function npm_start() {
  npm start $1$2>/dev/null
  sleep 1
}

function error_check() {
  curl -LI localhost:${PORT} -o /dev/null -w ${HTTP_STATUS} -s | grep ${SUCCESS} $1$2>/dev/null
}

npm_start
error_check
echo $?
