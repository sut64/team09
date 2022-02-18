import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

import { AuthoritiesInterface } from "../models/IAuthority";
import { PaymentmethodsInterface } from "../models/IPaymentmethod";
import { PrescriptionInterface } from "../models/IPrescription";
import { BillsInterface } from "../models/IBill";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { IconButton } from "@material-ui/core";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

function BillCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [authoritys, setAuthority] = useState<AuthoritiesInterface>();
  const [paymentmethods, setPaymentmethods] = useState<PaymentmethodsInterface[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionInterface[]>([]);
  const [bills, setBills] = useState<Partial<BillsInterface>>(
    {}
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errmessage, SetErrMessage] = useState("");
  const [successTime, setSuccessTime] = useState(false);
  const [MessageTime, setMessageTime] = useState("");

  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
  const [prescriptionAmount, setPrescriptionAmount] = useState<PrescriptionInterface>();

  const handleChangePrescription = (
    event: React.ChangeEvent<{ name?: string; value: any }>
  ) => {
    const name = event.target.name as keyof typeof bills;
    setBills({
      ...bills,
      [name]: event.target.value,
    });
    if (name === "PrescriptionID"){
      localStorage.setItem("AmountID", event.target.value);
      getPrescriptionAmount();
    }

    // let p = prescriptions.map((item: PrescriptionInterface) => (item))
    // for(let i = 0 ; i < p.length; i++){
    //   if (Number(p[i].ID) == Number(event.target.value)){
    //     setDisbursementID(Number(p[i].MedicineDisbursementID));
    //     getDisbursements();
    //     //getMedicinestorageSell();
    //   } 
    // }


    // let d = disbursements.map((item: Medicine_disbursementInterface) => (item))
    // for(let i = 0 ; i < d.length; i++){
    //   console.log(Number(disbursementID));
    //   if (Number(d[i].ID) == Number(disbursementID)){
    //     setMedicinestorageID(Number(d[i].MedicineStorageID));
    //     localStorage.setItem(String(medicineID), event.target.value);
    //     getMedicinestorageSell(); 
    //   } 
    // }
  };

  // const getMedicinestorageSell = async () => {
  //   let uid = disbursementID;
  //   fetch(`${apiUrl}/medicineStorage/${uid}`, requestOptions)
  //   .then((response) => response.json())
  //   .then((res) => {
  //       if (res.data) {
  //         setMedicinestorageSell(res.data);
  //         console.log(res.data);
  //       } else {
  //         console.log("else");
  //       }
  //     });
  // };

  // const getMedicinestorage = async () => {
  //   //let uid = localStorage.getItem(String(disbursementID));
  //   //let uid = medicinestorageID ;
  //   fetch(`${apiUrl}/medicineStorages`, requestOptions)
  //   .then((response) => response.json())
  //   .then((res) => {
  //       if (res.data) {
  //         setMedicinestorage(res.data);
  //         console.log(res.data);
  //       } else {
  //         console.log("else");
  //       }
  //     });
  // };

  const getPrescriptionAmount = async () => {
    let uid = localStorage.getItem("AmountID");
    fetch(`${apiUrl}/PrescriptionNo/${uid}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
        if (res.data) {
          setPrescriptionAmount(res.data);
          console.log(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }>
  ) => {
    const name = event.target.name as keyof typeof bills;
    setBills({
      ...bills,
      [name]: event.target.value,
    });
  };

  function PresentlyTime() {
    let date = new Date();
    let timer = date.toLocaleTimeString(); //เเสดงเวลา 
    let day = date.toLocaleDateString(); //เเสดงวันที่
    console.log(date);
    setSelectedDate(date);
    setSuccessTime(true);
    setMessageTime("รีเซ็ตเวลาปัจจุบันสำเร็จ : วันที่ " + day + " เวลา " + timer);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessTime(false);
    setSuccess(false);
    setError(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof BillCreate;
    const { value } = event.target;
    setBills({ ...bills, [id]: value });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const getAuthority = async () => {
    let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/authority/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        bills.AuthoritiesID = res.data.ID
        if (res.data) {
          setAuthority(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getPaymentmethods = async () => {
    //let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/paymentmethods`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        //cases.PatientID = res.data.ID
        if (res.data) {
          setPaymentmethods(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getPrescriptions = async () => {
    fetch(`${apiUrl}/PrescriptionPaymentStatusNotPaid`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setPrescriptions(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getAuthority();
    getPaymentmethods();
    getPrescriptions();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
        AuthoritiesID: convertType(authoritys?.ID),
        PaymentmethodID: convertType(bills.PaymentmethodID),
        PrescriptionID: convertType(bills.PrescriptionID),
        BillTime: selectedDate,
        BillNo: convertType(bills.BillNo ?? ""),
        Payer: bills.Payer ?? "",
        Total: convertType(Number(prescriptionAmount?.MedicineDisbursement?.MedicineStorage?.Sell) * Number(prescriptionAmount?.Amount)),
        //Total: convertType(bills.Total ?? ""),
    };
    console.log(data)

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/bills`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log("บันทึกการชำระเงินได้")
          setSuccess(true);
          SetErrMessage("")
        } else {
          console.log("บันทึกการชำระเงินไม่ได้")
          setError(true);
          SetErrMessage(res.error);
        }
      });
  }

  return (
    <Container className={classes.container} maxWidth="md">

      <Snackbar open={success} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกการชำระเงินสำเร็จ
        </Alert>
      </Snackbar>

      <Snackbar open={error} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกการชำระเงินไม่สำเร็จ : {errmessage}
        </Alert>
      </Snackbar>

      <Snackbar open={successTime} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {MessageTime}
        </Alert>

      </Snackbar>

      <Paper className={classes.paper}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              การชำระเงินค่ายา
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/bills"
              variant="contained"
              color="primary"
              style={{ backgroundColor: '#AED6F1', fontSize: 'verdana', color: '#4682B4' }}>
              ประวัติชำระเงินค่ายา
            </Button>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>

        <Grid item xs={3}>
            <p>รหัสชำระเงิน</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="BillNo"
                variant="outlined"
                type="number"
                size="medium"
                placeholder="รหัสชำระเงิน"
                InputProps={{
                  inputProps: { min: 1000,
                                max: 9999 }
                }}
                value={bills.BillNo || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth variant="outlined">
              <p>รหัสการสั่งยา</p>
              <Select
                native
                value={bills.PrescriptionID}
                onChange={handleChangePrescription}
                inputProps={{
                  name: "PrescriptionID",
                }}
              >
                <option aria-label="None" value="0">
                
                </option>
                {prescriptions.map((item: PrescriptionInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.PrescriptionNo}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

        <Grid item xs={3}>
            <FormControl fullWidth variant="outlined">
              <p>รูปแบบการชำระเงิน</p>
            <Select
                native
                value = {bills.PaymentmethodID}
                onChange={handleChange}
                inputProps={{
                    name: "PaymentmethodID",
                }}
            >
              <option aria-label="None" value="">
              
                </option>
              {paymentmethods.map((item: PaymentmethodsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.ConditionsOfPayments}
                  </option>
                ))}  
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <p>ชื่อยา</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                variant="outlined"
                disabled
                type="string"
                size="medium"
                placeholder="ผู้ชำระเงิน"
                value={prescriptionAmount?.MedicineDisbursement?.MedicineStorage?.Name}
                //onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <p>ผู้ชำระเงิน</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="Payer"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="ผู้ชำระเงิน"
                value={bills.Payer || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <p>ราคายาต่อหน่วย</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                disabled
                variant="outlined"
                type="number"
                size="medium"
                placeholder="ราคายาต่อหน่วย"
                value={prescriptionAmount?.MedicineDisbursement?.MedicineStorage?.Sell}
                //value={medicinestorageSell?.Sell}
                //onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <p>จำนวนยา</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                disabled
                variant="outlined"
                type="number"
                size="medium"
                placeholder="จำนวนยา"
                value={prescriptionAmount?.Amount} 
                //onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <p>ราคารวม</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="Total"
                disabled
                variant="outlined"
                type="number"
                size="medium"
                placeholder="ราคารวม"
                value={Number(prescriptionAmount?.MedicineDisbursement?.MedicineStorage?.Sell) * Number(prescriptionAmount?.Amount)}
                //onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลาชำระเงิน</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="BillTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="กรุณาเลือกวันที่และเวลา"
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          
          <Grid item xs={1}>
            <FormControl fullWidth variant="outlined">
              <p>
                <br></br>
              </p>
            </FormControl>
            <IconButton onClick={PresentlyTime}>
                  <Typography variant="caption">
                  <RestartAltIcon/>reset
                  </Typography>
                </IconButton>
          </Grid>

          <Grid item xs={5}>
            <FormControl fullWidth variant="outlined">
              <p>ผู้ให้ชำระเงิน</p>
            <Select
                native
                disabled
                style={{ float: "right"}}
                value = {bills.AuthoritiesID}
                onChange={handleChange}
                inputProps={{
                    name: "AuthoritiesID",
                }}
            >
              <option value={authoritys?.ID} key={authoritys?.ID}>
                  {authoritys?.FirstName} {authoritys?.LastName}
                </option>  
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              style={{ backgroundColor: '#4682B4', fontSize: 'verdana', color: '#ffffff' }}
            >
              <ArrowBackTwoToneIcon/>
            </Button>
            <Button
              style={{ float: "right", backgroundColor: '#AED6F1', fontSize: 'verdana', color: '#4682B4' }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              ชำระเงินค่ายา
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default BillCreate;
