# Banking System Backend — personal banking sandbox

A standalone, browser-only banking dashboard demo. It presents two fictional sample accounts, their available balances, and a sample transaction ledger. Despite the project name, this repository is only a front-end sandbox—not a banking backend.

## What works in the demo

- View the available balances for Everyday Checking and Growth Savings, plus a combined sample balance and illustrative monthly totals.
- Select either account to filter the activity ledger; search transactions and switch between all activity and simulated transfers.
- Create a simulated transfer between the two sample accounts. The form checks that the accounts differ, the amount is positive and no greater than the available sample balance, and the amount is within the demo limit. An optional note is supported.
- Review the source, destination, amount, and optional note in a confirmation step. On confirmation, the demo updates both balances and adds debit and credit ledger entries.
- Keep demo changes in this browser's `localStorage`, including after a page reload. Use the reset control to restore the original sample data.

## Sample-data and integration boundary

Every name, account identifier, balance, and ledger entry is synthetic sample data. Transfers are simulated updates to browser storage only: they do not contact a bank, payment network, or external service and do not move real funds. No account, card, or payment secrets are requested. The app has no authentication, backend, database, API, or network requests; it is not suitable for real financial use.

The reference technology list—**Python, Django, PostgreSQL, AWS**—describes a potential full-stack version only. None of those technologies or services is connected by this no-build browser demo; there is no bank integration.

## Run locally

1. Open a terminal in this folder.
2. Run `python3 -m http.server 8765`.
3. Open [http://localhost:8765](http://localhost:8765) in your browser.

The demo uses only the included HTML, CSS, and browser JavaScript files and requires no installation or build step.
