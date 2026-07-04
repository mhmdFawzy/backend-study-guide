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

# Init git if this folder was copied without .git
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  git branch -M main
fi

# Commit if nothing committed yet
if ! git rev-parse HEAD &>/dev/null; then
  echo "Creating initial commit..."
  git add .
  git commit -m "Initial commit: interactive backend study guide"
fi

echo "Creating public repo: $REPO"

# Create repo and push (or push if repo already exists)
if gh repo view "$REPO" &>/dev/null; then
  echo "Repo already exists — pushing to origin..."
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$REPO.git"
  git push -u origin main
else
  gh repo create "$REPO" \
    --public \
    --description "Interactive backend study guide for frontend engineers" \
    --source=. \
    --remote=origin \
    --push
fi

echo ""
echo "✅ Repo created and pushed!"
echo ""
echo "Last step — enable GitHub Pages (FREE, no Actions needed):"
echo "  1. Open https://github.com/$REPO/settings/pages"
echo "  2. Under 'Build and deployment', set Source to: Deploy from a branch"
echo "  3. Branch: main  |  Folder: / (root)"
echo "  4. Click Save — wait ~1 min"
echo ""
echo "Your site will be live at:"
echo "  https://$(echo "$USERNAME" | tr '[:upper:]' '[:lower:]').github.io/backend-study-guide/"
echo ""
echo "Note: GitHub Pages is 100% free for public repos. No Actions required."
