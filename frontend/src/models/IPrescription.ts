import { AuthoritiesInterface } from "./IAuthority"
import { MedicineRoomInterface } from "./IMedicineRoom";
import { PaymentStatusInterface } from "./IPaymentStatus";

export interface PrescriptionInterface {
	ID: number,
	PatientName: string,
	PrescriptionNo: number,
	AuthorityID: number,
	AuthoritiesID: number,
	Authorities: AuthoritiesInterface,
	MedicineRoomID: number,
	MedicineRoom: MedicineRoomInterface,
	Amount: number,
	PaymentStatusID: number,
	PaymentStatus: PaymentStatusInterface,
	RecordingTime: Date,
}
