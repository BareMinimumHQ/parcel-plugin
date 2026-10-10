# Parcel plugin

<img src="plugins/parcel/assets/logo.png" alt="Parcel" width="96" height="96" />

[Parcel](https://workinparcel.com/) helps you organize your job search. Compare roles, tailor resumes and cover letters, research companies, and practise interviews with your connected assistant. Install Parcel in ChatGPT, Codex, Claude, or Claude Code using the instructions below. After installation, sign in to Parcel and choose the access you want to give your assistant.

## ChatGPT

In ChatGPT, open **Plugins**, find **Parcel**, and add it. Connect your Parcel account when prompted, review the requested access, then start a new chat. Parcel must be listed in the ChatGPT Plugins Directory for this installation path to appear.

## Codex

Add this repository as a marketplace:

```sh
codex plugin marketplace add BareMinimumHQ/parcel-plugin
```

In an interactive Codex session, open `/plugins`, select **Parcel**, and install it. Sign in to Parcel in your browser, review the requested access, then start a new session.

## Claude

In Claude, open **Customize → Plugins → Discover**, find **Parcel**, and select **Add**.

You can also install from this repository: open **Customize → Plugins → Add → Add marketplace → Add from a repository** and enter `BareMinimumHQ/parcel-plugin`. Then find **Parcel** in **Discover** and add it. With either route, connect your Parcel account when prompted and review the requested access.

## Claude Code

Add this repository as a marketplace and install Parcel:

```sh
claude plugin marketplace add BareMinimumHQ/parcel-plugin
claude plugin install parcel@parcel
```

Connect your Parcel account in your browser when prompted and review the requested access.

## Development and releases

Run `node scripts/validate.mjs` for package checks. Follow [AGENTS.md](AGENTS.md) when changing plugin guidance or its server contract expectations.

Merging a plugin fix or documentation change into main lets Release Please prepare a release PR. Merging that release PR cuts the version and attaches inspected packages. Guidance changes need a plugin release to reach provider-distributed packages; website-only changes do not require a plugin release. Provider publication and user updates follow each provider's distribution process.
