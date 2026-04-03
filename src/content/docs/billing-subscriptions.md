---
title: Billing and Subscriptions
sidebar_position: 4
description: Understand ChoreHero plans, Stripe-backed billing, where to manage subscriptions, and how plan changes affect features.
---

# Billing and subscriptions

ChoreHero uses household-scoped billing. The plan applies to the family, not to one individual child profile.

## Current plan shape

The repo currently documents three plan tiers:

| Plan | Summary |
| --- | --- |
| Free | Default starting plan for a household |
| Plus | Paid plan with more automation, access, and proof-related features |
| Pro | Highest tier with the broadest entitlement set and larger limits |

The current feature matrix also documents monthly and yearly offers for paid tiers, with yearly pricing positioned at roughly **2 months free**.

## Where to manage billing

Start from the parent-facing app:

1. Open [app.chorehero.cloud/login](https://app.chorehero.cloud/login)
2. Go to **Parent Dashboard > Settings > Account**
3. Use the available billing or customer-portal actions from there

![Billing section in Parent Dashboard account tab](/img/help-guides/billing-account-tab.png)

ChoreHero uses Stripe-backed billing workflows for checkout and subscription management.

## What can change when a plan changes

Some features are tied to the active household plan or subscription status. That can affect:

- AI-assisted parent workflows
- proof uploads
- child quick login and device approvals
- announcements
- push notifications
- integrations
- feature limits such as children, active chores, or rewards

If a capability disappears after cancellation, downgrade, expiration, or a billing issue, review the current plan state first.

## Trial and renewal expectations

The current internal feature matrix documents:

- no trial on Free
- 14-day trial behavior on Plus
- 14-day trial behavior on Pro

If your product policy changes, update both this article and the internal feature matrix in the same pull request.

## Billing issue checklist

Use this short checklist before escalating:

- confirm you are signed in to the correct household
- open **Settings > Account**
- confirm whether the plan is active, trialing, canceled, inactive, or past due
- note which feature changed behavior
- compare the issue against [Troubleshooting](/docs/troubleshooting)
