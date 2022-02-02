import { AuthoritiesInterface } from "./IAuthority"
import { Medicine_disbursementInterface } from "./IMedicine_disbursement";
import { PaymentStatusInterface } from "./IPaymentStatus";

export interface PrescriptionInterface {
	ID: number,
	PatientName: string,
	PrescriptionNo: number,
	AuthorityID: number,
	AuthoritiesID: number,
	Authorities: AuthoritiesInterface,
	MedicineDisbursementID: number,
	MedicineDisbursement: Medicine_disbursementInterface,
	Amount: number,
	PaymentStatusID: number,
	PaymentStatus: PaymentStatusInterface,
	RecordingTime: Date,
}
