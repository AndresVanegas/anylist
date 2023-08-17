export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  dbName: process.env.DB_NAME,
  port: process.env.PORT || 3009,
});
