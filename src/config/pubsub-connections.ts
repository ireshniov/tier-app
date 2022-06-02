export const connections: string[] = (process.env.RABBITMQ_PUBSUB_URL || '')
  .split('|')
  .filter((s: string): number => s.trim().length);
