import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
  alpha,
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

import { DateTimePicker } from "@material-ui/pickers";

import { AuthoritiesInterface } from "../models/IAuthority";
import { PaymentmethodsInterface } from "../models/IPaymentmethod";
import { PrescriptionInterface } from "../models/IPrescription";
import { BillsInterface } from "../models/IBill";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { checkServerIdentity } from "tls";
//import Users from "./Informers";

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

  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof bills;
    setBills({
      ...bills,
      [name]: event.target.value,
    });
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
    fetch(`${apiUrl}/Prescriptions`, requestOptions)
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
        Total: convertType(bills.Total ?? ""),
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
          console.log("บันทึกได้")
          setSuccess(true);
          SetErrMessage("")
        } else {
          console.log("บันทึกไม่ได้")
          setError(true);
          SetErrMessage(res.error);
        }
      });
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ {errmessage}
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
              บันทึกการชำระเงินค่ายา
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>

        <Grid item xs={4}>
            <p>ใบชำระเงิน</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="BillNo"
                variant="outlined"
                type="number"
                size="medium"
                placeholder="เลขใบชำระเงิน"
                value={bills.BillNo || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>ใบสั่งยา</p>
              <Select
                native
                value={bills.PrescriptionID}
                onChange={handleChange}
                inputProps={{
                  name: "PrescriptionID",
                }}
              >
                <option aria-label="None" value="">
                
                </option>
                {prescriptions.map((item: PrescriptionInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.PrescriptionNo}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>


        <Grid item xs={4}>
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

          <Grid item xs={6}>
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

          <Grid item xs={6}>
            <p>ราคารวม</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="Total"
                variant="outlined"
                type="number"
                size="medium"
                placeholder="ราคารวม"
                value={bills.Total || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>
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


          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผู้ให้ชำระเงิน</p>
            <Select
                native
                disabled
                value = {bills.AuthoritiesID}
                onChange={handleChange}
                inputProps={{
                    name: "AuthoritiesID",
                }}
            >
              <option value={authoritys?.ID} key={authoritys?.ID}>
                  {authoritys?.FirstName}
                </option>  
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/bills"
              variant="contained"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default BillCreate;
