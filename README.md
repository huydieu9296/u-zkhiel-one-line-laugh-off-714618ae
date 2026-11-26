# One-Line Laugh-Off

[![One-Line Laugh-Off](https://make.fun/badge/u-zkhiel-one-line-laugh-off-714618ae.svg)](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae)
[![Rank](https://make.fun/badge/u-zkhiel-one-line-laugh-off-714618ae/huydieu9296/u-zkhiel-one-line-laugh-off-714618ae/rank.svg)](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae)
[![Reward](https://make.fun/badge/u-zkhiel-one-line-laugh-off-714618ae/huydieu9296/u-zkhiel-one-line-laugh-off-714618ae/reward.svg)](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae)

Entry for the [One-Line Laugh-Off](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae) bounty on make.fun — exactly one funny line, no setup notes, no explanation.

> My printer only jams when I'm in a hurry — I swear it can smell deadlines.

Length: 74 characters (limit: 1–200 characters, single line).

## How it works

`main.ts` is a zero-dependency TypeScript program (Node 22/24, no network). It locates `entry.txt` sitting next to itself using an absolute path derived from `import.meta.url`, reads the raw bytes, decodes them as strict UTF-8, and validates the entry: exactly one line (no CR or LF), 1–200 characters counted in Unicode code points, and not empty or whitespace-only. It then creates the output directory from the `MAKEFUN_OUTPUT_DIR` environment variable (falling back to `/output`), writes the raw bytes unchanged to `entry.txt` inside it, reads the output back, and verifies it is byte-identical to the source before printing the output path, character count, byte count, and the entry text.

## Run

```sh
node main.ts
```

To write the entry elsewhere:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/out-laugh node main.ts
```
