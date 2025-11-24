#!/usr/bin/env bash
set -o errexit

cd frontend
npm install
npm run build
cd ..

pip install -r requirements.txt
