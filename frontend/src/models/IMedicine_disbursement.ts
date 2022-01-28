import { AuthoritiesInterface } from "./IAuthority"
import { MedicinestorageInterface } from "./IMedicinestorage"
import { MedicineRoomInterface } from "./IMedicineRoom"

export interface Medicine_disbursementInterface {
    ID: number,
    DisbursementID: string,
    DisbursementDAY: Date,
    AmountMedicine: number,
    AuthoritiesID: number,
    Authorities: AuthoritiesInterface,
    MedicineStorageID: number,
    MedicineStorage: MedicinestorageInterface,
    MedicineRoomID: number,
    MedicineRoom: MedicineRoomInterface
}