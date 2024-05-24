require('dotenv').config();

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  token: {
    accessToken: process.env.ACCESS_TOKEN_KEY,
    refreshToken: process.env.REFRESH_TOKEN_KEY,
    tokenAge: process.env.ACCESS_TOKEN_AGE,

  },
};
module.exports = config;
