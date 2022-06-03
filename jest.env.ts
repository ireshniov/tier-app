// ###################### COMMON ######################
process.env.NODE_ENV = 'testing';
process.env.SERVER_PORT = '3000';
// ###################### COMMON ######################

// ###################### LOGGING ######################
process.env.LOG_LEVEL = 'debug';
process.env.LOG_FORMAT_USE_JSON = 'false';
process.env.HTTPLOG_DISABLED = 'false';
process.env.DB_LOGGING = 'true';
// ###################### LOGGING ######################

// ###################### DB ######################
process.env.DB_PASSWORD = 'test';
process.env.DB_USERNAME = 'test';
process.env.DB_DATABASE_NAME = 'test';
process.env.DB_URL = 'test';
// ###################### DB ######################

// ###################### REDIS ######################
process.env.REDIS_URL = 'test';
// ###################### REDIS ######################

// ###################### CACHE ######################
process.env.CACHE_HASH_COUNT = '1000';
process.env.URL_HASH_CACHE_TTL = '86400';
// ###################### CACHE ######################

// ################## RABBITMQ ##################
process.env.RABBITMQ_PUBSUB_URL = 'test';
// ################## RABBITMQ ##################
