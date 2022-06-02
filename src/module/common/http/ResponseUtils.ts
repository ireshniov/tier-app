import { Response } from 'express';

export function getLocation(response: Response): string {
  return (response.getHeader('location') || '').toString();
}
