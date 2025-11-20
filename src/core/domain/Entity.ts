// core/domain/Entity.ts

/**
 * Base class for all domain entities.
 *
 * - Has an identity (`id`)
 * - Equality is based on identity, not on all properties.
 */
export abstract class Entity<Props, IdType = string> {
  public readonly id: IdType;
  public readonly props: Readonly<Props>;

  protected constructor(props: Props, id: IdType) {
    this.id = id;
    // Shallow freeze props to discourage mutation
    this.props = Object.freeze({ ...props });
  }

  public equals(entity?: Entity<Props, IdType> | null): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this.id === entity.id;
  }
}
