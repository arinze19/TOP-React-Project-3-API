export default () => ({
  PORT: parseInt(process.env.PORT) || 4500,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  jwt: {
    expiry: process.env.JWT_EXPIRY_D,
  },
});
