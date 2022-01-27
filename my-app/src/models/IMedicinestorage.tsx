import {MedicinetypeInterface} from "./IMedicinetype"
export interface MedicinestorageInterface {
    ID: string;
    Name: string;
    Count: number;
    MedicinetypeID:number;
    Medicinetype: MedicinetypeInterface;
  }