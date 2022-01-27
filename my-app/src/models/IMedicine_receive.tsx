import {  PackingInterface } from "./IPacking";
import {  ReceiveInterface } from "./IReceive";
import { MedicinestorageInterface } from "./IMedicinestorage"

export interface Medicine_receiveInterface {
  ID: string;
  PackingID: number;
  Packing: PackingInterface;

  ReceiveID: number;
  Receive: ReceiveInterface;

  MedicinestorageID: number;
  Medicinestorage: MedicinestorageInterface;

	Received_date: Date;
	Expire: Date;
	Company: string;
	Count:number;
	Price_of_unit:Number;
}
