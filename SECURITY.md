# Security Policy

Security is part of the product, not an afterthought. This project will eventually include accounts, profiles, posts, voting, reporting, notifications and moderation workflows, so privacy and abuse prevention matter early.

## Reporting A Vulnerability

Until a private security contact is configured, please open a GitHub issue with minimal public detail and mark it as security-sensitive in the title. Do not include live secrets, private user data or exploit payloads in public issues.

For serious issues, contact a maintainer directly before publishing details.

## Security Expectations

- No secrets in commits.
- Server-side authorization for all write actions.
- Row-level security for user, moderation and community data.
- Rate limits for posting, voting, flagging and account creation.
- Audit trails for moderation decisions and role changes.
- Manual review for flagged community content.
- Privacy-first defaults for profiles, DMs and notifications.

## Not Yet Implemented

This repository currently contains a frontend prototype with local state. Authentication, persistence, authorization, moderation queues and production security controls still need to be implemented before public launch.
