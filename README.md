# Policy Engine Bot

## Prerequisites

- Modify .env file granting appropriate access (secret & access key for vector db & openai api)
- Download node.js through nvm \n
		- Releases · coreybutler/nvm-windows (github.com) \n
        - Select nvm-setup.exe \n
	  - Update nvm in PowerShell: nvm use latest \n
	  - Install nvm: nvm install latest \n
	  - Use nvm:: nvm use latest \n


## Starting the server:

```PowerShell
npm run dev
```

## Interacting with the Server:

- Install Chromium
- Run Chromium from PowerShell with disabled web security

```PowerShell
chromium --disable-web-security --disable-site-isolation-trials --user-data-dir="~/AppData/Local/Temp"
```

- Navigate to the localhost:port exposed by the `npm run dev` command
