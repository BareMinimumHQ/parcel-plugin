# Parcel

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

## Privacy and access

Your authorized assistant can read the Parcel information covered by the scopes you approve, including Career Profile details, Jobs, and saved documents. Requested saves update your Parcel account. Browsing and independent review use your assistant provider's capabilities. Viewing a PDF may transfer its content to that provider; its privacy policy also applies.

Review [Parcel's privacy policy](https://workinparcel.com/privacy) and [terms](https://workinparcel.com/terms). Use Account settings on the Parcel website to revoke a connection or delete your account. Deletion does not promise immediate removal from provider conversations, logs, or backups. Contact [support](https://workinparcel.com/support) for help.

The plugin connects only to Parcel at `https://workinparcel.com/mcp` through OAuth. Reads retrieve your authorized workspace information; requested saves send the content and changes to Parcel. Document views may fetch the saved PDF from Parcel. It runs no local commands or installers and has no hooks.

This plugin provides one Parcel skill with eight workflows and connects to Parcel's hosted OAuth MCP server. It does not run a local server, submit applications, contact employers, guarantee an offer, or perform account deletion from the conversation. Embedded views depend on the host; saved data remains available through the tools when a view is unavailable.

Licensed under [GPL-3.0-only](https://github.com/BareMinimumHQ/parcel-plugin/blob/main/plugins/parcel/LICENSE).
