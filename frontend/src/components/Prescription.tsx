import DateFnsUtils from "@date-io/date-fns";
import { Box, Button, Container, createStyles, Divider, FormControl, Grid, makeStyles, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Theme, Typography } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { MedicineRoomInterface } from "../models/IMedicineRoom";
import { AuthoritiesInterface } from "../models/IAuthority";
import { PrescriptionInterface } from "../models/IPrescription";
import { PaymentStatusInterface } from "../models/IPaymentStatus";
import { CartItemType } from "../models/IItem";

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
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  }),
);

function Medicine() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [medicineRooms, setMedicineRooms] = useState<MedicineRoomInterface[]>([]);
  const [medicineRoom, setMedicineRoom] = useState<Partial<MedicineRoomInterface>>({});
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatusInterface>();
  const [paymentStatus, setPaymentStatus] = useState<Partial<PaymentStatusInterface>>({});
  const [authorities, setAuthorities] = useState<AuthoritiesInterface>();
  const [prescriptions, setPrescriptions] = useState<PrescriptionInterface[]>([]);
  const [prescription, setPrescription] = useState<Partial<PrescriptionInterface>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [cartItem, setCartItem] = useState<Partial<CartItemType>>({});


  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }>
  ) => {
    const name = event.target.name as keyof typeof prescription;
    setPrescription({
      ...prescription,
      [name]: event.target.value,
    });
  };

  const handleItemName = (
    event: React.ChangeEvent<{ name?: string; value: any }>
  ) => {
    const name = event.target.name as keyof typeof cartItem;
    localStorage.setItem("medicineID", event.target.value);
    setCartItem({
      ...cartItem,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    // console.log(date);
    setSelectedDate(date);
  };

  // const handleDateChange = (date: Date | null) => {
  //   console.log(date);
  //   setSelectedDate(date);
  // };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof prescription;
    const { value } = event.target;
    setPrescription({ ...prescription, [id]: value });
  };

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



  const getMedicineRooms = async () => {
    fetch(`${apiUrl}/medicineRooms`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setMedicineRooms(res.data);
          // console.log(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getPaymentStatuses = async () => {
    fetch(`${apiUrl}/paymentStatus/1`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        prescription.Payment_statusID = res.data.ID;
        if (res.data) {
          setPaymentStatuses(res.data);
          // console.log(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getAuthority = async () => {
    let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/authority/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        prescription.AuthorityID = res.data.ID;
        if (res.data) {
          setAuthorities(res.data);
          // console.log(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getAuthority();
    getMedicineRooms();
    getPaymentStatuses();
    setInterval(() => {
      const date = new Date();
      setSelectedDate(date);
    }, 1000);
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      PatientName: prescription.PatientName,
      PrescriptionNo: convertType(prescription.PrescriptionNo),
      AuthoritiesID: authorities?.ID,
      MedicineRoomID: convertType(prescription.MedicineRoomID),
      Amount: convertType(prescription.Amount),
      Payment_statusID: prescription.Payment_statusID,
      RecordingTime: selectedDate,
    };
    // console.log(data)

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/Prescriptions`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
          window.location.href = "/prescription";
        } else {
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
              ระบบสั่งยา
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={8}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อยา</p>
              <Select
                native
                value={medicineRoom.ID}
                onChange={handleChange}
                inputProps={{
                  name: "MedicineRoomID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกยา
                </option>
                {medicineRooms.map((item: MedicineRoomInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>จำนวน</p>
              <TextField
                id="Amount"
                variant="outlined"
                type="number"
                size="medium"
                placeholder="กรุณากรอกจำนวนยา"
                value={prescription.Amount || ""}
                onChange={handleInputChange}

              />
            </FormControl>
          </Grid>
          {/* <Grid item xs={1}>
                <Button
                    
                    style={{ float: "right", marginTop: 48, height: 55, backgroundColor: "#1FCE58", borderColor: "#000000", borderWidth: 5, borderRadius: 5}}
                    variant="contained"
                    color="primary"
                    
                >
                เพิ่ม
                </Button>
              </Grid> */}
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผู้ป่วย: ชื่อ-นามสกุล</p>
              <TextField
                id="PatientName"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="กรุณากรอกชื่อ-นามสกุล"
                value={prescription.PatientName || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผู้สั่งยา</p>
              <Select
                native
                value={prescription.AuthorityID}
                onChange={handleChange}
                disabled
                inputProps={{
                  name: "AuthorityID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกผู้สั่งยา
                </option>

                <option value={authorities?.ID} key={authorities?.ID}>
                  {authorities?.FirstName} {authorities?.LastName}
                </option>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={5}>
            <FormControl fullWidth variant="outlined">
              <p>เลขที่ใบสั่งยา</p>
              <TextField
                id="PrescriptionNo"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="กรุณากรอกเลขที่ใบสั่งยา"
                value={prescription.PrescriptionNo || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth variant="outlined">
              <p>สถานะการชำระเงิน</p>
              <Select
                native
                disabled
                value={prescription.Payment_statusID}
                onChange={handleChange}
                inputProps={{
                  name: "Payment_statusID",
                }}
              >
                <option aria-label="None" value="">
                  สถานะการชำระเงิน
                </option>
                <option value={paymentStatuses?.ID} key={paymentStatuses?.ID}>
                  {paymentStatuses?.Status}
                </option>

              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                name="RecordingTime"
                value={selectedDate}
                onChange={handleDateChange}
                label="กรุณาเลือกวันที่และเวลา"
                minDate={new Date("2018-01-01T00:00")}
                format="dd-MM-yyyy hh:mm:ss a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Button
              component={RouterLink}
              to="/"
              style={{ float: "left" }}
              variant="contained"
            >
              กลับ
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button

              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              สั่งยา
            </Button>
          </Grid>
        </Grid>

      </Paper>
    </Container>
  );
}

export default Medicine;