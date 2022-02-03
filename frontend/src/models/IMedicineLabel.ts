import { Medicine_disbursementInterface } from "./IMedicine_disbursement";
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
  MedicineDisbursementID: number,
	MedicineDisbursement: Medicine_disbursementInterface,
  SuggestionID: number,
  Suggestion: SuggestionsInterface,
  EffectID: number,
  Effect: EffectsInterface,
}