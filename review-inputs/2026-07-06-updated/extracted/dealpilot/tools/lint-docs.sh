#!/usr/bin/env bash
# DealPilot docs lint — banned phrases + cross-reference integrity.
# Mitigation arm of risk-register #101 (cross-doc doctrine drift). Run from repo root; CI job runs it on every PR.
set -uo pipefail
cd "$(dirname "$0")/.."
FAIL=0

# --- 1. Banned phrases (perimeter + absolutes). review-response.md and ban-list lines are exempt (they quote the bans).
BANNED=(
  "hallucination-free"
  "forgeable by no one"
  "never invent facts"
  "structurally incapable"
  "guaranteed accurate"
  "buy/sell/pass output"
  "Pursue / Pass"
  "auditable recommendation"
  "zero rigor"
)
for p in "${BANNED[@]}"; do
  HITS=$(grep -rn --include='*.md' -i -F "$p" docs README.md \
    | grep -v 'review-response.md' \
    | grep -vi 'banned\|prohibit\|never use\|ban-list' || true)
  if [ -n "$HITS" ]; then
    echo "BANNED PHRASE [$p]:"; echo "$HITS"; FAIL=1
  fi
done

# --- 2. Advice-verb scan (warn-level: classify each hit as safe-shorthand or rewrite)
ADVICE=$(grep -rn --include='*.md' -E '\b(you should (buy|acquire|pass)|we recommend (buying|acquiring|passing))\b' docs README.md | grep -v 'review-response.md' | grep -vi 'advice-language' || true)
if [ -n "$ADVICE" ]; then echo "ADVICE LANGUAGE:"; echo "$ADVICE"; FAIL=1; fi

# --- 3. Cross-reference integrity (backtick .md refs must resolve)
python3 - <<'PY'
import re, os, glob, sys
missing = []
for f in glob.glob('docs/**/*.md', recursive=True) + ['README.md']:
    base = os.path.dirname(f)
    for m in set(re.findall(r'`((?:\.\./|\./)?[a-z0-9/_-]+\.md)`', open(f).read())):
        if m.startswith('/'): continue
        if not os.path.exists(os.path.normpath(os.path.join(base, m))):
            missing.append(f'{f} -> {m}')
if missing:
    print('BROKEN REFERENCES:'); print('\n'.join(sorted(missing))); sys.exit(1)
PY
[ $? -ne 0 ] && FAIL=1

if [ "$FAIL" -eq 0 ]; then echo "docs lint: CLEAN"; else echo "docs lint: FAILURES ABOVE"; fi
exit $FAIL
