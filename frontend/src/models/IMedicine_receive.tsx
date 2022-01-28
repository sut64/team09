import { PackingInterface } from "./IPacking";
import { ReceiveInterface } from "./IReceive";
import { MedicinestorageInterface } from "./IMedicinestorage"
import { AuthoritiesInterface } from "./IAuthority";

export interface Medicine_receiveInterface {
  ID: string;
  PackingID: number;
  Packing: PackingInterface;

  ReceiveTypeID: number;
  ReceiveType: ReceiveInterface;

  MedicineStorageID: number;
  MedicineStorage: MedicinestorageInterface;

  AuthoritiesID: number,
	Authorities: AuthoritiesInterface,
  
  Receiveddate: Date;
  Expire: Date;
  Company: string;
  Count: number;
  Price_of_unit: Number;
}
