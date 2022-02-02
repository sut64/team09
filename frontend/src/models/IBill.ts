import { PrescriptionInterface } from "./IPrescription";
import { PaymentmethodsInterface } from "./IPaymentmethod";
import { AuthoritiesInterface } from "./IAuthority";

export interface BillsInterface {
  ID: string,
  BillNo:number,
  BillTime: Date,
  Payer:string,
  Total:number,
  
  PrescriptionID: number,
  Prescription: PrescriptionInterface,

  PaymentmethodID: number,
  Paymentmethod: PaymentmethodsInterface,

  AuthoritiesID : number ,
  Authorities: AuthoritiesInterface,
}
