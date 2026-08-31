# Keeping Node alive

This page is for you, not for an agent. It covers the one piece of software on
your desktop that this app depends on, and what to do when it misbehaves.

## The one thing worth knowing first

**Node is only needed to change the app. It is never needed to use it.**

Once the app has been built and published, it is a handful of ordinary files on
the internet. Your phone and your desktop just open them. If Node broke on your
computer tomorrow — uninstalled, corrupted, gone — the budget would carry on
working on both devices exactly as before. You would only notice when someone
next tried to change something.

That is why this page can be short.

## The version

**Node 24.19.0.**

It is written down in a file called `.nvmrc` at the top of this project. That
one line is what your computer and GitHub both read, so they always build the
app the same way. If you ever change the version, change it there and nowhere
else.

To see what you have installed, open **Windows Terminal** or **PowerShell** and
type:

```
node --version
```

You want it to say `v24.19.0`, or another `v24.` something. If it says `v22.`
or `v26.`, see *When to change the version* below.

## Installing it

Go to <https://nodejs.org/en/download> and download the **Windows Installer
(.msi)** for **24.19.0**. Run it and click through. Nothing needs configuring.

If that exact version is no longer on the front page, older versions are all
kept at <https://nodejs.org/dist/v24.19.0/> — the file you want is
`node-v24.19.0-x64.msi`.

Installing a new version over an old one is fine and normal. There is no need
to uninstall anything first.

## Rebuilding the app

You should not have to do this by hand — publishing happens on its own whenever
a change is saved to GitHub. But this is what it is doing, and how to do it
yourself if you ever need to.

Open a terminal in the project folder and run these two lines, in order:

```
npm install
npm run build
```

The first line fetches the tools the build needs. The second builds the app into
a folder called `dist`. A good build ends with a line starting `✓ built in`.

To look at what you built before anyone else sees it:

```
npm run preview
```

That prints an address like `http://localhost:4173/budget_app/`. Open it in your
browser. Press `Ctrl+C` in the terminal to stop it.

## When a rebuild fails

Work down this list. Stop as soon as it builds.

**1. Read the last few lines, not the first.** Build tools print a lot. The
sentence that matters is usually near the bottom and usually says the name of a
file.

**2. Try it once more.** `npm install` reaches out to the internet and sometimes
just fails. Running the same two commands again fixes this surprisingly often.

**3. Throw away the downloaded tools and get them again.** This fixes most of
the rest. In the project folder:

```
rmdir /s /q node_modules
npm install
npm run build
```

(In PowerShell the first line is `Remove-Item -Recurse -Force node_modules`.)

**4. Check the Node version.** Run `node --version`. If it does not start with
`v24.`, install 24.19.0 as above and try again.

**5. Hand it to an agent.** Copy the whole terminal output — all of it, not just
the last line — and give it to a coding agent with the sentence *"the build is
failing, here is what it printed"*. This is the normal way out, not an
admission of defeat. Everything an agent needs to diagnose it is in that output.

**Nothing here can break the budget.** A failed build publishes nothing; the app
that is already live stays live, and your data was never in the build to begin
with — it lives in Google Drive.

## When to change the version

**The default answer is: don't.** A version of Node that builds the app today
will still build it in two years. Updating it on a schedule buys nothing and
risks a morning of debugging for no benefit.

There are only two reasons to move:

- **Node 24 stops getting security fixes.** That happens in **April 2028**. It
  is worth moving some time before then, to whichever version is labelled *LTS*
  on nodejs.org that day.
- **Something genuinely needs a newer Node** and says so in an error message.

When you do move, change the version in `.nvmrc`, run `npm install` and
`npm run build`, and check the app still looks right with `npm run preview`.

## Where things live

| Thing | Where |
|---|---|
| The Node version | `.nvmrc` |
| The list of tools the build uses | `package.json` and `package-lock.json` |
| The app's source | `src/` |
| The built app | `dist/` — created by the build, never edited by hand |
| The instructions GitHub follows to publish | `.github/workflows/publish.yml` |
| The published app | <https://slejer99.github.io/budget_app/> |

## If publishing stops working

Publishing runs on GitHub, not on your computer, so a problem there is not
something Node can cause.

Go to <https://github.com/slejer99/budget_app/actions>. Each push shows as a
green tick or a red cross. Click a red one to see what it printed — and then
follow step 5 above: hand the output to an agent.

Two settings have to stay as they are for publishing to work at all, and both
live under **Settings → Pages** in that repository:

- **Source** must be **GitHub Actions**.
- The repository must stay **public**. GitHub only publishes pages from private
  repositories on a paid plan.
