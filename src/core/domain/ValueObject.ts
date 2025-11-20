// core/domain/ValueObject.ts

/**
 * Base class for value objects.
 *
 * - No identity (`id`)
 * - Equality is based on *all* properties.
 */
export abstract class ValueObject<Props> {
  public readonly props: Readonly<Props>;

  protected constructor(props: Props) {
    // Shallow freeze to discourage mutation
    this.props = Object.freeze({ ...props });
  }

  public equals(vo?: ValueObject<Props> | null): boolean {
    if (vo === null || vo === undefined) return false;
    if (this === vo) return true;

    // Simple structural comparison for JSON-friendly props.
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
