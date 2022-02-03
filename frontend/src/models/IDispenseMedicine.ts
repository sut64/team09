import { BillsInterface } from "./IBill";
import { Dispense_statusInterface } from "./IDispense_status";
import { AuthoritiesInterface } from "./IAuthority";

export interface Dispense_MedicineInterface {
  ID: number,
  DispensemedicineNo: number,
  ReceiveName:   string,
  DispenseTime: Date,
  BillID: number,
  Bill: BillsInterface,
  DispenseStatusID: number,
  DispenseStatus: Dispense_statusInterface,
  AuthoritiesID: number,
  Authorities: AuthoritiesInterface,
}