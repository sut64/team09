import { MedicineRoomInterface } from "./IMedicineRoom";
import { SuggestionsInterface } from "./ISuggestion";
import { EffectsInterface } from "./IEffect";
import { AuthoritiesInterface } from "./IAuthority"
export interface MedicineLabelsInterface {
  ID: number,
  Instruction: string,
  Property: string,
  Consumption: number,
  Date: Date,
  AuthoritiesID: number,
  Authorities: AuthoritiesInterface,
  MedicineRoomID: number,
  MedicineRoom: MedicineRoomInterface,
  SuggestionID: number,
  Suggestion: SuggestionsInterface,
  EffectID: number,
  Effect: EffectsInterface,
}