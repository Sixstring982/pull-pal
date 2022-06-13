import { InjectionToken } from "tsyringe";

export const ENSURE_CONSTRUCTRED: InjectionToken<unknown> = 
  Symbol('EnsureConstructed');