export default () => ({
  PORT: parseInt(process.env.PORT) || 4500,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXP_D: process.env.JWT_EXP_D,
});
