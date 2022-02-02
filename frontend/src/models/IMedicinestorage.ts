import {MedicinetypeInterface} from "./IMedicinetype"
export interface MedicinestorageInterface{
    ID:     number,
	Name:   string,
	Count:  number,
	Sell: number,
	MedicineTypeID:	number,
	MedicineType:	MedicinetypeInterface
}