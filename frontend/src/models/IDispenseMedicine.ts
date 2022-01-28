import { MedicineLabelsInterface } from "./IMedicineLabel";
import { PrescriptionInterface } from "./IPrescription";
import { Dispense_statusInterface } from "./IDispense_status";
import { AuthoritiesInterface } from "./IAuthority";

export interface Dispense_MedicineInterface {
  ID: number,
  DispensemedicineNo: string,
  Amount:   number,
  DispenseTime: Date,
  MedicineLabelID: number,
  MedicineLabel: MedicineLabelsInterface,
  PrescriptionID: number,
  Prescription: PrescriptionInterface,
  DispenseStatusID: number,
  DispenseStatus: Dispense_statusInterface,
  AuthoritiesID: number,
  Authorities: AuthoritiesInterface,
}