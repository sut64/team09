import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
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
import MenuItem from "@material-ui/core/MenuItem";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { PackingInterface } from "../models/IPacking";
import { Medicine_receiveInterface } from "../models/IMedicine_receive";
import { ReceiveInterface } from "../models/IReceive";
import { MedicinestorageInterface } from "../models/IMedicinestorage"
import {MedicinetypeInterface} from "../models/IMedicinetype" 
import moment from "moment";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { AuthoritiesInterface } from "../models/IAuthority";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { flexGrow: 1 },
    container: { marginTop: theme.spacing(2) },
    paper: { padding: theme.spacing(2), color: theme.palette.text.secondary },
  })
);

function UserCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date() );
  const [selectedDateR, setSelectedDateR] = React.useState<Date | null>(new Date() );
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errmessage, SetErrMessage] = useState("");
  //Models
  const [authorities, setAuthorities] = useState<AuthoritiesInterface>();
  const [packings, setPackings] = useState<PackingInterface[]>([]);
  const [receive, setReceive] = useState<ReceiveInterface[]>([]);
  const [medicinestorage, setMedicinestorage] = useState<MedicinestorageInterface[]>([]);
  const [medicinetype, setMedicinetype] = useState<MedicinetypeInterface[]>([]);
  const [medicinetypeID, setMedicinetypeID] = useState<Number | null>(null);
  const [mreceive, setMreceive] = useState<Partial<Medicine_receiveInterface>>({});


  //handle

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof mreceive;
    const { value } = event.target;
    setMreceive({ ...mreceive, [id]: value });
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const handleDateChangeR = (date: Date | null) => {
    setSelectedDateR(date);
  };
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown}>
  ) => {
    const name = event.target.name as keyof typeof mreceive;
    console.log("handleChange")
    console.log(name)
    console.log(event.target.value)
    setMreceive({
      ...mreceive,
      [name]: event.target.value,
    });
  };
  const handleChangeMED = (
    event: React.ChangeEvent<{ name?: string; value: unknown;}>
  ) => {
    const name = event.target.name as keyof typeof mreceive;
    setMreceive({
      ...mreceive,
      [name]: event.target.value,
    });
    let a = medicinestorage.map((item: MedicinestorageInterface) => (
      item
  ))
  for(let i = 0 ; i < a.length; i++){
    if (Number(a[i].ID) == Number(event.target.value)){
      //  console.log(a[i].ID)
      //  console.log(a[i].MedicinetypeID)
       setMedicinetypeID(Number(a[i].MedicineTypeID));
    } 
  }
  };

  //GET
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
  
  const getPackings = async () => {
    fetch(`${apiUrl}/packings`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setPackings(res.data);
          console.log(res.data);
        } else {
          console.log("else");
        }
      });
  };
  const getType = async () => {
    fetch(`${apiUrl}/medicineTypes`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setMedicinetype(res.data);
          console.log(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getReceives = async () => {
    fetch(`${apiUrl}/receives`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setReceive(res.data);
          
        } else {
          console.log("else");
        }
      });
  };

  const getMedicinestorage = async () => {
    fetch(`${apiUrl}/medicineStorages`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setMedicinestorage(res.data);
          console.log("ยา"+res.data);
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
        mreceive.AuthoritiesID = res.data.ID;
        if (res.data) {
          setAuthorities(res.data);
          // console.log(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getPackings();
    getReceives();
    getMedicinestorage();
    getType();
    getAuthority();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      PackingID: convertType(mreceive.PackingID),
      ReceiveTypeID: convertType(mreceive.ReceiveTypeID),
      MedicineStorageID: convertType(mreceive.MedicineStorageID),
      AuthoritiesID: authorities?.ID,
      Company: mreceive.Company,
      Count: convertType(mreceive.Count),
      Price_of_unit: Number(mreceive.Price_of_unit),
      Expire: selectedDate,
      Receiveddate: new Date()
    }
    console.log(data);
    const apiUrl = "http://localhost:8080/medicinereceive";
    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
          SetErrMessage("")
        } else {
          setError(true);
          SetErrMessage(res.error)
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
        บันทึกข้อมูลไม่สำเร็จ: {errmessage}
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
              ใบรับยาเข้าคลัง
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
        <Grid item xs={4}>
            <p>ชื่อหน่วยงาน</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="Company"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="ชื่อหน่วยงาน"
                value={mreceive.Company || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <p>หน่วยงาน</p>
            <FormControl fullWidth variant="outlined">
            <Select
                  id="Receive"
                  value={mreceive.ReceiveTypeID}
                  onChange={handleChange}
                  inputProps={{
                    name: "ReceiveTypeID",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {receive.map((item: ReceiveInterface) => (
                      <MenuItem value={item.ID} key={item.ID}>
                      {item.Name}
                     
                      </MenuItem>
                  ))}
                  </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>ยา</p>
             
              <Select
                  id="Medicinetorage"
                  value={mreceive.MedicineStorageID}
                  onChange={handleChangeMED}
                  inputProps={{
                    name: "MedicineStorageID"
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {medicinestorage.map((item: MedicinestorageInterface) => (
                      <MenuItem value={item.ID} key={item.ID}>
                      {item.Name}
                      </MenuItem>
                  ))}
                  </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>วันและเวลาที่รับ</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  margin="normal"
                  id="BirthDay"
                  disabled = {true}
                  format="yyyy/MM/dd HH:mm a"
                  value={moment()}
                  onChange={handleDateChangeR}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>ราคาต่อหน่วย</p>
              <TextField
                id="Price_of_unit"
                variant="outlined"
                type="number"
                size="medium"
                placeholder="0"
                value={mreceive.Price_of_unit || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
             <p>หน่วย</p>
             <Select
                  id="Packing"
                  value={mreceive.PackingID}
                  onChange={handleChange}
                  inputProps={{
                    name: "PackingID",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {packings.map((item: PackingInterface) => (
                      <MenuItem value={item.ID} key={item.ID}>
                      {item.Name}
                      </MenuItem>
                  ))}
                  </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>จำนวน</p>
              <TextField
                id="Count"
                variant="outlined"
                type="number"
                size="medium"
                placeholder="0"
                value={mreceive.Count || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>ประเภทยา</p>
              <Select
                  id="Medicinestorage"
                  value={medicinetypeID}
                  disabled = {true}
                  inputProps={{
                    name: "MedicineStorageID",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {medicinetype.map((item: MedicinetypeInterface) => (
                      <MenuItem value={item.ID} key={item.ID}>
                      {item.Name}
                      </MenuItem>
                  ))}
                  </Select>
    
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>วันหมดอายุ</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="BirthDay"
                  format="yyyy/MM/dd "
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button component={RouterLink} to="/listreceived" variant="contained">
              Back
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default UserCreate;
