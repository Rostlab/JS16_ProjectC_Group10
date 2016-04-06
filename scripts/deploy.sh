#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

rm -rf builds
mkdir builds

# config
git config --global user.email "nobody@nobody.org"
git config --global user.name "Travis CI"

# build
npm run build
npm run deploy

# deploy
git add .
git commit -m"Travis automatic deployment"
git push