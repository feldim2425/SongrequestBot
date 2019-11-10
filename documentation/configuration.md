# Configuration

## Server configuration
```json5
server: {
    /*
     * This option allows you to disable and enable https.
     * To enable https you have to set this option to true and
     * setup the "https" option below
     */
    "enable_https": false,
    
    /*
     * This option sets the password for the dashboard. An empty string
     * disables the login function. Default password is 'admin'
     * To see how to change it you can look below.
     */
    "dashboard_sha256": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    
    "https": {
      /*
       * Set the path to the certificate of a trusted authority.
       * This is used by the node tls library to establish a connection
       * using untrusted certificates. It is not required to enable HTTPS.
       * Defaults to null
       */
      "ca": "ssl/ca.pem",

      /*
       * Set the path to the public certificate here. This is required 
       * to enable HTTPS 
       */
      "cert": "ssl/key.pem",
      
      /*
       * Set the path to the private key here. The Keyfile has to be
       * decrypted (no password required). This is required 
       * to enable HTTPS 
       */
      "key": "ssl/key.pem",
    }
  }
```

### Tips
To change the serverpassword you can use a online text to sha256 converter.
The resulting hash can be pastet in the ``dashboard_sha256`` option. Linux users can also use the command ``$ echo -n <password> | sha256sum`` to get the sha256 hash. Plain text passwords will not work. There is no option in the admin dashboard to change the password, it can therefore only be changed by someone who has access to the config file.

For TLS certificated I recommend using [LetsEncrypt](https://letsencrypt.org/de/getting-started/).
You can also use self-signed certificates made with OpenSSL but they will probably show a warning on your browser, because they aren't signed by a trusted authority. To make a self-signed certificate Linux users can use the following command: ``$ openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes`` ... this will generate a unencrypted key-file ``key.pem`` and a certificate ``cert.pem``. The certificate is valid for 365 days.
