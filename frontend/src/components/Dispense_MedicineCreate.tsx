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

import { AuthoritiesInterface } from "../models/IAuthority";
import { BillsInterface } from "../models/IBill";
import { Dispense_statusInterface } from "../models/IDispense_status";
import { Dispense_MedicineInterface } from "../models/IDispenseMedicine";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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

function Dispense_MedicineCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [authorities, setAuthorities] = useState<AuthoritiesInterface>();
  const [bills, setBills] = useState<BillsInterface[]>([]);
  const [dispenseStatuses, setDispense_Statuses] = useState<Dispense_statusInterface>();
  const [dispense_medicines, setDispense_Medicines] = useState<Partial<Dispense_MedicineInterface>>({});
  

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    const name = event.target.name as keyof typeof dispense_medicines;
    setDispense_Medicines({
      ...dispense_medicines,
      [name]: event.target.value,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof Dispense_MedicineCreate;
    const { value } = event.target;
    setDispense_Medicines({ ...dispense_medicines, [id]: value });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const getAuthorities = async () => {   // const หรือ constant คือตัวแปลที่เก็บค่าคงที่
    let uid = localStorage.getItem("uid"); // let เหมือน var แต่จะไม่เป็น global
    fetch(`${apiUrl}/authority/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        dispense_medicines.AuthoritiesID = res.data.ID
        if (res.data) {
          setAuthorities(res.data);
        } else {
          console.log("else"); // console.log แสดงผลลัพธ์
        }
      });
  };

  const getBills = async () => {
    fetch(`${apiUrl}/bills`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setBills(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getDispense_Statuses = async () => {
    fetch(`${apiUrl}/dispenseStatus/จ่ายแล้ว`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        dispense_medicines.DispenseStatusID = res.data.ID;
        if (res.data) {
          setDispense_Statuses(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {  // ทำงานทุกครั้งที่เรา รีหน้าเว็บ
    getAuthorities();
    getBills();
    getDispense_Statuses();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      BillID: convertType(dispense_medicines.BillID),
      DispenseStatusID: dispense_medicines.DispenseStatusID,
      AuthoritiesID: convertType(authorities?.ID),

      DispenseTime: selectedDate,
      ReceiveName: dispense_medicines.ReceiveName ?? "",
      DispensemedicineNo: convertType(dispense_medicines.DispensemedicineNo ?? ""),
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

    fetch(`${apiUrl}/dispenseMedicines`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          /* console.log("บันทึกได้") */
          setSuccess(true);
          setErrorMessage("");
        } else {
          /* console.log("บันทึกไม่ได้") */
          setError(true);
          setErrorMessage(res.error);
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
          บันทึกข้อมูลไม่สำเร็จ: {errorMessage}
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
              บันทึกการจ่ายยา
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/dispense_medicines"
              variant="contained"
              color="primary"
            >
              {/* style={{ backgroundColor: '#FAFAD2', fontSize: 'verdana', color: '#FFA07A' }}> */}
              ประวัติการจ่ายยา
            </Button>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>

          <Grid item xs={6}>
            <p>เลขใบจ่ายยา</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="DispensemedicineNo"
                variant="outlined"
                type="number"
                size="medium"
                placeholder="เลขใบจ่ายยา"
                InputProps={{
                  inputProps: { min: 100000,
                                max: 999999 }
                }}
                value={dispense_medicines.DispensemedicineNo || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ใบชำระเงิน</p>
              <Select
                native
                value={dispense_medicines.BillID}
                onChange={handleChange}
                inputProps={{
                  name: "BillID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกใบชำระเงิน
                </option>
                {bills.map((item: BillsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.BillNo}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผู้ชำระเงิน</p>
              <Select
                native
                disabled
                value={dispense_medicines.BillID}
                onChange={handleChange}
                inputProps={{
                  name: "BillID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกใบชำระเงิน
                </option>
                {bills.map((item: BillsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Payer}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อยา</p>
              <Select
                native
                disabled
                value={dispense_medicines.BillID}
                onChange={handleChange}
                inputProps={{
                  name: "BillID",
                }}
              >
                {bills.map((item: BillsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Prescription.MedicineDisbursement.MedicineRoom}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>สถานะจ่ายยา</p>
              <Select
                native
                disabled
                value={dispense_medicines.DispenseStatusID}
                onChange={handleChange}
                inputProps={{
                  name: "DispenseStatusID",
                }}
              >
                <option aria-label="None" value="">
                สถานะจ่ายยา
                </option>
                <option value={dispenseStatuses?.ID} key={dispenseStatuses?.ID}>
                  {dispenseStatuses?.Status}
                </option>

              </Select>
              {/* <Select
                native
                value={dispense_medicines.DispenseStatusID}
                onChange={handleChange}
                inputProps={{
                  name: "DispenseStatusID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกสถานะจ่ายยา
                </option>
                {dispense_statuses.map((item: Dispense_statusInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Status}
                  </option>
                ))}
              </Select> */}
            </FormControl>
          </Grid>
          
          <Grid item xs={6}>
            <p>ผู้รับยา</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="ReceiveName"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="ผู้รับยา"
                value={dispense_medicines.ReceiveName || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผู้ใช้</p>
              <Select
                native
                disabled
                // value={register.OwnerID}
                // onChange={handleChange}
                // inputProps={{
                //   name: "OwnerID",
                // }}
              >
                {/* <option value={0}>
                  {authorities?.FirstName}
                </option> */}
                <option value={authorities?.ID} key={authorities?.ID}>
                  {authorities?.FirstName}
                </option>
                {/* <option value={users?.ID} key={users?.ID}>
                  {users?.Name}
                </option> */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="DispenseTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="กรุณาเลือกวันที่และเวลา"
                  minDate={new Date("2021-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/"
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

export default Dispense_MedicineCreate;