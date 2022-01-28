import { Dispense_MedicineInterface } from "./IDispenseMedicine";
import { PricesInterface } from "./IPrice";
import { PaymentmethodsInterface } from "./IPaymentmethod";
import { AuthoritiesInterface } from "./IAuthority";

export interface BillsInterface {
  ID: string,
  BillNo:string,
  BillTime: Date,
  Payer:string,
  Total:number,
  

  DispenseMedicineID: number,
  DispenseMedicine: Dispense_MedicineInterface,

  PaymentmethodID: number,
  Paymentmethod: PaymentmethodsInterface,

  PriceID: number,
  Price: PricesInterface,

  AuthoritiesID : number ,
  Authorities: AuthoritiesInterface,
}
