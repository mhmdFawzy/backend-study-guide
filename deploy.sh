#!/usr/bin/env bash
# One-command deploy to your GitHub account
# Usage: ./deploy.sh mhmdFawzy

set -e

USERNAME="${1:-}"

if [ -z "$USERNAME" ]; then
  echo "Usage: ./deploy.sh YOUR_GITHUB_USERNAME"
  echo "Example: ./deploy.sh mhmdFawzy"
  exit 1
fi

if ! command -v gh &>/dev/null; then
  echo "GitHub CLI (gh) is required. Install: https://cli.github.com"
  exit 1
fi

if ! gh auth status &>/dev/null; then
  echo "Please log in first: gh auth login"
  exit 1
fi

REPO="$USERNAME/backend-study-guide"
echo "Creating public repo: $REPO"

gh repo create "$REPO" \
  --public \
  --description "Interactive backend study guide for frontend engineers" \
  --source=. \
  --remote=origin \
  --push

echo ""
echo "✅ Repo created and pushed!"
echo ""
echo "Last step — enable GitHub Pages:"
echo "  1. Open https://github.com/$REPO/settings/pages"
echo "  2. Under 'Build and deployment', set Source to: GitHub Actions"
echo "  3. Wait ~1 min for the workflow to finish"
echo ""
echo "Your site will be live at:"
echo "  https://$USERNAME.github.io/backend-study-guide/"
echo ""
