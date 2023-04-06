/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive)
 */
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  /**
   * Clamps a value between the given minimum and maximum values.
   * @param value - The value to be clamped
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (inclusive)
   */
  export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
  
  /**
   * Converts degrees to radians.
   * @param degrees - The angle in degrees
   */
  export function degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
  
  /**
   * Converts radians to degrees.
   * @param radians - The angle in radians
   */
  export function radiansToDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  }
  