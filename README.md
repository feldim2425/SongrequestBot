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

* This server has **NO SSL/TLS encryption** therefore all passwords and tokens are sent in clear text.
* There is **NO authentication**, so everybody with the address can access the dashboard

If you want to put this on a external server, I recommend making it only accessible trough a VPN 
or use a Apache / NginX - HTTP proxy that adds SSL/TLS encryption and at least basic http authentication

## Limitations

### No Spotify streaming
The Spotify integration can't provide a audio stream to the internal players (webstream, discord voicechat, native playback), therefor playback is only possible trough a Spotify Client (Web, Desktop, Mobile, Third-Party devices) that supports remote controll from the spotify web api.

Since implementing this feature might violate Spotifies "Terms of Service" this feature won't be implemented even if a npm module appears that claims to capture the stream. Any pullrequests implementing this feature will get denied. The only way I will implement this is, if Spotify changes the ToS.

Specifically the [Spotify End-User-Agreement §9 "User guidelines"](https://www.spotify.com/us/legal/end-user-agreement/#s9) outlaws:
 * **(Point 1)** That we capture audio to broadcast or transfer it. This most definetly includes public streams like YouTube, Twitch, Mixer.
 * **(Point 3)** Use the cached audio files and broadcast them. So accessing the cached Spotify client data is also out.
 * **(Point 4)** ``reverse-engineering, decompiling, disassembling, modifying, or creating derivative works of the Spotify Service`` ... Since Spotify doesn't have a public streaming api, getting it trough reverse-engineering the client would violate that rule. Also browser plugins that modify the web-player are therefore not possible.
 * **(Point 5)** Basically outlaws everything we can do to circumvent any protection Spotify has to keep us from capturing their stream (or from any third-party client).
 * **(Point 7)** This is a bit more out for debate, but since this bot is intendet for streamers, playback trough the bot could be used to circumvent territorial restrictions.

 **WARNING: If you use the Spotify integration, you do so at your own risk. I'm not responsible for blocked spotify accounts or any legal actions taken against you** 