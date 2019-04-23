#!/usr/bin/env bash

mkdir \
  /app/cache \
  --parents --verbose

chown node:node \
  /app/cache \
  --verbose
