process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'debug';
process.env.LOG_FORMAT_USE_JSON = 'false';
process.env.HTTPLOG_DISABLED = 'false';
process.env.PORT = '3000';

process.env.POSTGRES_URL = 'test';
process.env.POSTGRES_LOGGING = 'false';
process.env.POSTGRES_MIGRATIONS_RUN = 'false';

process.env.REDIS_URL = 'test';

process.env.CACHE_HASH_COUNT = '1000';
process.env.URL_HASH_CACHE_TTL = '86400';

process.env.RABBITMQ_PUBSUB_URL = 'test';
