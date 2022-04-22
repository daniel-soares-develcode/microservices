export default () => ({
  port: parseInt(process.env.PORT, 10) || 3010,
  jwt: {
    secret: process.env.JWT_SECRET || 'secret'
  },
  database:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5442/users?schema=public',
  kafka: {
    broker: process.env.KAFKA_BROKER || 'localhost:29092',
    clientId: process.env.KAFKA_CLIENT_ID || 'users-service',
    groupId: process.env.KAFKA_GROUP_ID || 'leroy-merlin'
  }
})
