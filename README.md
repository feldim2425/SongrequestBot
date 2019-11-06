# Songrequest Bot [WIP]

This project is inspired by [TrojanerHDs Songrequest Bot](https://github.com/TrojanerHD/Songrequestbot).

Different from the original this bot has a seperate nodejs backend and a browser frontend. This way the bot can run on a seprate computer/server (better for streaming).

The whole project is made in Typescript and the frontend uses the Vue framework.

## Build instructions
```
$ yarn
$ yarn run build
$ yarn run start
```
You can build and run the project but it is still Work In Progress


## Warning / Info for external hosting

**DO NOT PUT THIS ON A PUBLIC ACCESSIBLE SERVER WITHOUT PUTTING ADDITIONAL SECURITY IN PLACE**

* This server has **NO SSL encryption** to the client therefore all passwords and tokens are sent in clear text.
* There is **NO authentication**, so everybody with the address can access the dashboard

If you want to put this on a external server, I recommend making it only accessible trough a VPN 
or use a Apache / NginX - HTTP proxy that adds SSL encryption and at least basic http authentication