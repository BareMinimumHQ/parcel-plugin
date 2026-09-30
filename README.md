# Parcel plugin

<img src="plugins/parcel/assets/logo.png" alt="Parcel" width="96" height="96" />

[Parcel](https://workinparcel.com/) helps you organize an agent-assisted job search. This repository packages Parcel's skills and MCP connection for ChatGPT, Codex, Claude, and Claude Code. After installation, sign in to Parcel and approve the access you want to give your agent.

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

## Marketplace branding

The package includes the approved Parcel logo for marketplace listings and submission. See the [branding assets](plugins/parcel/assets/README.md) for icon files and provider-specific usage.
