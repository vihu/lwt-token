# POC LWT token

## Pre-requisites

- Ensure that you have `solana` and `anchor` toolchains
  [installed](https://book.anchor-lang.com/getting_started/installation.html).
- Ensure that you have `solana-test-validator` working
  [locally](https://docs.solana.com/developing/test-validator).

## Setup

- Run `solana-test-validator`.
- Run `anchor build` in this repo.
- Run `solana address -k
  /path/to/lwt_token/target/deploy/lwt_token-keypair.json`. Copy the B58 and
  edit `programs/lwt_token/src/lib.rs` and `Anchor.toml` with _your_ B58.
- Run `anchor build` again.
- Run `anchor deploy` (ideally while monitoring your local
  solana-test-validator's logs with `solana logs`).
- Run `anchor test`.
