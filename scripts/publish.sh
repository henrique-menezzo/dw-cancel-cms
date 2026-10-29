#!/bin/sh
# Builds the prototype and pushes only the built site to the public repo that serves
# henrique-menezzo.github.io/dw-cancel-cms. The source stays private in henrique-menezzo/dw-cancel-cms-source.
set -e
cd "$(dirname "$0")/.."
npx tsc -b
npx vite build
cd dist
touch .nojekyll
rm -rf .git
git init -q -b main
git add -A
git -c user.name="Henrique Menezes" -c user.email=henrique@format-3.co commit -qm "Site build $(date +%Y-%m-%d)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -qf "https://x-access-token:$(gh auth token -u henrique-menezzo)@github.com/henrique-menezzo/dw-cancel-cms.git" main
rm -rf .git
echo "Published: https://henrique-menezzo.github.io/dw-cancel-cms/"
