import { Lifecycle, registry } from "tsyringe";
import { ENSURE_CONSTRUCTRED } from "../ensure_constructed";
import { BadgeService } from "./badge_service";

@registry([
  {
    token: ENSURE_CONSTRUCTRED,
    useClass: BadgeService,
    options: { lifecycle: Lifecycle.Singleton },
  },
])
export class BadgeRegistry {}
