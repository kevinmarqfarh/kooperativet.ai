# kooperativet.ai

Open-source forum for AI builders, vibe coders and people who want to build responsibly together.

The goal is a cooperative community platform: practical forum threads, reusable prompt banks, build logs, MVP matching, governance, manual moderation and inclusive review spaces. The project is intentionally open so members can inspect, improve and extend both the product and the community rules.

## Principles

- Human moderation over automated moderation for community decisions.
- Cooperative governance with visible proposals, decisions and stewardship.
- Inclusive participation by design, including safe feedback modes and explicit anti-harassment rules.
- Practical building artifacts: prompts, evals, build logs, launch notes and reusable guides.
- Security, privacy and compliance as first-class product concerns.

## Run Locally

```bash
npm install
npm run dev
```

## Current Scope

- Community dashboard with forum, prompt bank, build logs, MVP scene, profiles, guilds, governance, and moderation areas.
- Guidelines acceptance before participation.
- Local-state topic creation, voting, bookmarking, and user flagging.
- Manual moderation dashboard with reported items and status updates.
- Responsive desktop and mobile layouts.
- Mock thread detail view with replies, helpful answer, resources, flagging and cooperative matching.
- Settings for Swedish/English language and light/dark theme.

## Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [GOVERNANCE.md](GOVERNANCE.md) and [SECURITY.md](SECURITY.md).

Good first contribution areas:

- accessibility and mobile density
- community moderation workflows
- prompt bank versioning and eval receipts
- Supabase schema, auth and row-level security
- inclusive review rooms and onboarding

## Next Backend Steps

- Add real auth and role-based access control.
- Persist users, profiles, topics, comments, votes, prompts, reports, moderation actions, proposals, guilds, and notifications.
- Enforce write permissions, trust levels, rate limits, and moderation decisions on the server.

## License

MIT. See [LICENSE](LICENSE).
