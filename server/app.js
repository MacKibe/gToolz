const { google } = require("googleapis");
//
// To access the Google drive API we require the refresh token. client id, client token and redirect url

const REFRESH_TOKEN =
  "1//04mXwEttCOUIGCgYIARAAGAQSNwF-L9Irhl9yc1J3fL0nnaY3q9xaTXz1KZoy5pEsNYRgDwKuUg24EZX99Nmv6b-fonSrpStYRSA";

const CLIENT_ID =
  "29587586519-r0pg7nbaeish65duob4d8dl0ngeetq7e.apps.googleusercontent.com ";

const CLIENT_SECRET = "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";

const REDIRECT_URL = 'https://developers.google.com/oauthplayground'