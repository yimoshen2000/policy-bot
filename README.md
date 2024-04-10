# Policy Engine Bot

## Prerequisites

- .env file granting appropriate access

## Starting the server:

```PowerShell
npm run dev
```

## Interacting with the Server:

- Install Chromium
- Run Chromium from command line with disabled web security

```PowerShell
chromium --disable-web-security --disable-site-isolation-trials --user-data-dir="~/AppData/Local/Temp"
```

- Navigate to the localhost:port exposed by the `npm run dev` command
