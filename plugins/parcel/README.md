# Parcel plugin

![Parcel](assets/logo.png)

[Parcel](https://workinparcel.com/) helps you organize your job search, including jobs, application documents, company research, and interview preparation. Connect it to your chosen assistant to compare roles, prepare applications, and pick up where you left off. You choose what information your assistant can access when you connect Parcel.

To install it in **ChatGPT**, find Parcel under **Plugins** and add it after its directory listing is available. For **Codex**, add `BareMinimumHQ/parcel-plugin` as a marketplace, then install Parcel through `/plugins`. For **Claude**, find Parcel in **Customize → Plugins → Discover** after its directory listing is available, or add this repository as a marketplace through **Customize → Plugins → Add** and then add Parcel from **Discover**. For **Claude Code**, run `claude plugin marketplace add BareMinimumHQ/parcel-plugin` followed by `claude plugin install parcel@parcel`.

Connect a Parcel account when prompted and approve the information your assistant may access. Job Posting capture and company research use the browsing tools available in your assistant.

Resume, Cover Letter, and Talking Points drafts use an independent factual reviewer when your assistant can dispatch one. Otherwise, your assistant presents the draft, explains that independent review did not run, and asks you to confirm its facts and approve saving. Drafting does not save or submit an application.

## Privacy and access

Your authorized assistant can read the Parcel information covered by the scopes you approve, including Career Profile details, Jobs, and saved documents. Requested saves update your Parcel account. Browsing and independent review use your assistant provider's capabilities. Viewing a PDF may transfer its content to that provider; its privacy policy also applies. Never put passwords, access tokens, or other secrets in a Job, document, or conversation.

Review [Parcel's privacy policy](https://workinparcel.com/privacy) and [terms](https://workinparcel.com/terms). Use Account settings on the Parcel website to revoke a connection or delete your account. Deletion does not promise immediate removal from provider conversations, logs, or backups. Contact [support](https://workinparcel.com/support) for help.

This plugin contains eight workflows and connects to Parcel's hosted OAuth MCP server. It does not run a local server, submit applications, contact employers, guarantee an offer, or perform account deletion from the conversation. Embedded views depend on the host; saved data remains available through the tools when a view is unavailable.

Licensed under [GPL-3.0-only](LICENSE).

Your assistant may also help with external applications using its own browser or other tools when you authorize that work. Parcel does not perform those actions. Saving a document or changing a Job status in Parcel does not confirm that an external application was submitted.
