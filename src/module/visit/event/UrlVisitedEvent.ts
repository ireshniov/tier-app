export class UrlVisitedEvent {
  constructor(
    public readonly hash: string,
    public readonly destination: string,
    public readonly date: Date,
  ) {}
}
