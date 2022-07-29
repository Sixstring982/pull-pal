import * as fc from "fast-check";
import { mapUndefinable, toList } from "./nullable";

describe("Nullable utilities", () => {
  describe("mapUndefinable", () => {
    test("Returns undefined for an undefined argument", () => {
      fc.assert(
        fc.property(
          fc.func(fc.anything().filter((x) => x !== undefined)),
          (fn) => {
            expect(mapUndefinable(undefined, fn)).toBeUndefined();
          }
        )
      );
    });

    test("Returns fn(a) for an argument that is not undefined", () => {
      fc.assert(
        fc.property(
          fc.anything().filter((x) => x !== undefined),
          fc.func(fc.anything()),
          (a, fn) => {
            expect(mapUndefinable(a, fn)).toEqual(fn(a));
          }
        )
      );
    });
  });

  describe("toList", () => {
    test("Returns an empty list for an undefined argument", () => {
      expect(toList(undefined)).toEqual([]);
    });

    test("Returns a singleton list for an argument that is not undefined", () => {
      fc.assert(
        fc.property(
          fc.anything().filter((x) => x !== undefined),
          (a) => {
            expect(toList(a)).toEqual([a]);
          }
        )
      );
    });
  });
});
