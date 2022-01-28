import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
  alpha,
} from "@material-ui/core/styles";
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
import { MedicineLabelsInterface } from "../models/IMedicineLabel";
import { PrescriptionInterface } from "../models/IPrescription";
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
  const [medicine_labels, setMedicine_Labels] = useState<MedicineLabelsInterface[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionInterface[]>([]);
  const [dispense_statuses, setDispense_statuses] = useState<Dispense_statusInterface[]>([]);
  const [dispense_medicine, setDispense_Medicine] = useState<Partial<Dispense_MedicineInterface>>(
    {}
  );

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

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
    const name = event.target.name as keyof typeof dispense_medicine;
    setDispense_Medicine({
      ...dispense_medicine,
      [name]: event.target.value,
    });
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
        dispense_medicine.AuthoritiesID = res.data.ID
        if (res.data) {
          setAuthorities(res.data);
        } else {
          console.log("else"); // console.log แสดงผลลัพธ์
        }
      });
  };

  const getMedicine_Labels = async () => {
    fetch(`${apiUrl}/medicineLabels`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setMedicine_Labels(res.data);
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

  const getDispense_statuses = async () => {
    fetch(`${apiUrl}/dispense_statuses`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setDispense_statuses(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {  // ทำงานทุกครั้งที่เรา รีหน้าเว็บ
    getAuthorities();
    getMedicine_Labels();
    getPrescriptions();
    getDispense_statuses();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      MedicineLabelID: convertType(dispense_medicine.MedicineLabelID),
      PrescriptionID: convertType(dispense_medicine.PrescriptionID),
      DispenseStatusID: convertType(dispense_medicine.DispenseStatusID),
      AuthoritiesID: convertType(authorities?.ID),
      DispenseTime: selectedDate,
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
          console.log("บันทึกได้")
          setSuccess(true);
        } else {
          console.log("บันทึกไม่ได้")
          setError(true);
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
          บันทึกข้อมูลไม่สำเร็จ
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
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ฉลากยา</p>
              <Select
                native
                value={dispense_medicine.MedicineLabelID}
                onChange={handleChange}
                inputProps={{
                  name: "MedicineLabelID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกฉลากยา
                </option>
                {medicine_labels.map((item: MedicineLabelsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    ฉลากยา {item.ID}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ใบสั่งยา</p>
              <Select
                native
                //disabled
                value={dispense_medicine.PrescriptionID}
                onChange={handleChange}
                inputProps={{
                  name: "PrescriptionID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกใบสั่งยา
                </option>
                {prescriptions.map((item: PrescriptionInterface) => (
                  <option value={item.ID} key={item.ID}>
                    ใบสั่งยา {item.ID}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>สถานะจ่ายยา</p>
              <Select
                native
                value={dispense_medicine.DispenseStatusID}
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
              </Select>
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
                <option value={0}>
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
              to="/dispense_medicines"
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