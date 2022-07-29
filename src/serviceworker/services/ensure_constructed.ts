import { InjectionToken } from "tsyringe";

/**
 * This token is used to ensure that a specific service is constructed when the
 * service worker starts. This is done by resolving all of this token's bindings
 * immediately upon startup.
 * 
 * It's useful to bind services with this token that don't have dependents -
 * usually these are services which receive events, and emit them externally.
 * For example, in this repo, the `BadgeService` respond to events by updating
 * the Chrome extension badge - it has no dependents, but needs to be running.
 */
export const ENSURE_CONSTRUCTRED: InjectionToken<unknown> =
  Symbol("EnsureConstructed");
