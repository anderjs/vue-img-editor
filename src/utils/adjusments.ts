export function hasAdjustments<T extends object>(brightness: T): boolean {
  return Object.values(brightness).some((v) => v !== 0)
}
