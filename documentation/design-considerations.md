# Design considerations
This software probably has some shortcomings since some compromises for legality and development resources had to be made.

## Usability

### No automated HTTP to HTTPS redirection
Yes this feature isn't implemented because it...
 1. ...would required a second server implementation
 2. ...can't run on the same port as the HTTPS server so it would even end up almost completly useless unless the user configures port 80 for HTTP and 433 for HTTPS (in this case the browser would select the port automatically)
   

## Legality

### No Spotify audio
This bot can only play songs on spotify and not caputre their audio. This topic is digussed further in the README file of this project

## Security

### Admin panel has no real user system
I thought that it would be overkill to implement a full user system. The bot isn't intendet for groups with multiple admins and the dashboard is also not intendet for the public. The whole system is designed to manage song requests for streamers, and that's usually one person managing the whole system. No need for multiple users, just some basic security.

### Admin panel only uses a SHA-256 hash
To be clear, I know that *better* hashing methods for passwords exist (like PBKDF2, BCrypt, SCrypt, Argon2) and I also used no salting. The reason for that is that, there are some more serious problems if someone gets their hand on the configuration file. The Twitch OAuth token, Discord bot token and spotify token is stored there. Other than that, I don't think this system will be victim of many attacks, but if the attacker gains access to the machine where the config file is stored, there is little that can be done by a music bot.

### Login credentials in the config file are not encrypted
There are only 2 semi-good ways to implement that, either the password for decryption has to be hardcoded, either in the source or a startup script, or the user has to enter the password every time the bot starts. While the first option would add exactly 0 to the security, the second option has two problems:
 1. I don't expect many people taking this thing too seriously. Therefore the passwords will probably end up rather weak or might even leak trough the stream, if he constantly has to retype it.
 2. It would cut down on usability and just add some overhead to the overall setus.

And again: If the attacker gains access to the machine where the config file is stored, there is little that can be done by a music bot.

He couls for example just restart be but with a few patches that give him the password, as long as the user doesn't notice it he can do what he wants with the source code.


### Discord, Twitch, Spotify, ... tokens are not synced with the clients
You might have noticed that the Password, Token, OAuth fields in the settings panel of the dashboard are always empty when you log in. Thats because I didn't want to send an attacker every piece of sensitive information just because he got into the admin panel. There is a big chance that an attacker who gained access to the panel doesn't have access to the whole machine, so sensitive configuration is never synced with the client.

### No Content-Security-Policy
I had one but I also removed it, just because it didn't make that much sense. Basically I ended up just adding exceptions in the rules to allow Vue, Websockets, Bootstrap, etc. to work correctly. It also made deploying the system to a server more complex since the user would have to change the policy to make the URL whitelisted. They are also not that good to midigate XSS attacks. Since this bot handles everything trough Vue and dosn't store a whole lot of untrusted input, I don't think XSS is going to be a big problem.
