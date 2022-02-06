import React from 'react';
import { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import {MuiPickersUtilsProvider,KeyboardDatePicker,KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { TextField } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

import { MedicinestorageInterface } from "../models/IMedicinestorage";
import { MedicinetypeInterface } from "../models/IMedicinetype";
import { Medicine_disbursementInterface } from "../models/IMedicine_disbursement";
import { MedicineRoomInterface } from "../models/IMedicineRoom";
import { AuthoritiesInterface } from "../models/IAuthority";



const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
 createStyles({
   root: {flexGrow: 1},
   container: {marginTop: theme.spacing(3),display: 'flex',flexWrap: 'wrap'},
   paper: {padding: theme.spacing(2),color: theme.palette.text.secondary},
   textField: {marginLeft: theme.spacing(1),marginRight: theme.spacing(1),width: 300},
   formControl: {margin: theme.spacing(1),minWidth: 260,},
   selectEmpty: {marginTop: theme.spacing(2)},

 })
);

function Medicine_disbursementCreate() {
  const classes = useStyles();
  const [selectedDate1, setSelectedDate1] = useState<Date | null>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [medicinestorage, setMedicinestorage] = useState<MedicinestorageInterface[]>([]);
  const [medicinerooms, setMedicinerooms] = useState<MedicineRoomInterface[]>([]);
  const [medicinetypeID, setMedicinetypeID] = useState<Number | null>(null);
  const [medicinestorages, setMedicinestorages] = useState<Partial<MedicinestorageInterface>>({});
//   const [room, setRoom] = useState<Partial<MedicineroomInterface>>({});
  const [authoritiys, setAuthoritiys] = useState<AuthoritiesInterface>();
  const [medicinetype, setMedicinetypes] = useState<MedicinetypeInterface[]>([]);
  const [disbursements, setDisbursements] = useState<Partial<Medicine_disbursementInterface>>({});

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
    const name = event.target.name as keyof typeof disbursements;
    setDisbursements({
      ...disbursements,
      [name]: event.target.value,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof disbursements;
    const { value } = event.target;
    setDisbursements({ ...disbursements, [id]: value });
  };

  const handleChangeMedic = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof disbursements;
    setDisbursements({
      ...disbursements,
      [name]: event.target.value,
    });
    const id = Number(event.target.value);
    // getMedicinetype(id);
    //  console.log(id) 
     let v = medicinestorage.map((item: MedicinestorageInterface) => (
      item
    ))
    for(let i = 0 ; i < v.length; i++){
      if (Number(v[i].ID) == Number(event.target.value)){
        //  console.log(a[i].ID)
        //  console.log(a[i].MedicinetypeID)
         setMedicinetypeID(Number(v[i].MedicineTypeID));
      } 
    }
  };

  

  // const handleDateChange1 = (date: Date | null) => {
  //   console.log(date);
  //   setSelectedDate1(date);
  // };
  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };


  const getAuthoritiys = async () => {
    const uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/authority/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        // rentals.TenantID = res.data.ID
        // console.log(res.data);
        if (res.data) {
          setAuthoritiys(res.data);
        } else {
          console.log("else");
        }
      });
  };



  const getMedicinetype = async (uid: number) => {
    // const uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/medicineType/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
            console.log(res.data);
          setMedicinetypes(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getMedicinerooms = async () => {
    fetch(`${apiUrl}/medicineRooms`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
        setMedicinerooms(res.data);
        } else {
          console.log("else");
        }
      });
  };


  const getMedicinetypes = async () => {
    fetch(`${apiUrl}/medicineTypes`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setMedicinetypes(res.data);
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
        } else {
          console.log("else");
        }
      });
  };

  const getDisbursements = async () => {
    fetch(`${apiUrl}/disbursements`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setDisbursements(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getAuthoritiys();
    getMedicinerooms();
    getMedicinetypes();
    getMedicinestorage();
    //getDisbursements();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      DisbursementID: disbursements.DisbursementID ?? "",
      DisbursementDAY: selectedDate,
      AmountMedicine: convertType(disbursements.AmountMedicine) ,
      AuthoritiesID: convertType(authoritiys?.ID),
      MedicineStorageID: convertType(disbursements.MedicineStorageID),  
      MedicineRoomID:convertType(disbursements.MedicineRoomID), 
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

    fetch(`${apiUrl}/disbursements`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
          setErrorMessage("")
        } else {
          setError(true);
          setErrorMessage(res.error)
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
                gutterBottom>
                เบิกยา
            </Typography>
        </Box>
      </Box>
    <Divider />
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={4}>
       <p>เลขใบเบิกยา</p>
        <FormControl fullWidth variant="outlined">
        <TextField
          id="DisbursementID"
          variant="outlined"
          type="string"
          size="medium"
          value={disbursements.DisbursementID || ""}
          onChange={handleInputChange}
          />
        </FormControl>
    </Grid>
        <Grid item xs={4}>
            <FormControl fullWidth variant="outlined" disabled>
            <p>ผู้เบิก</p>
        <Select
          native
          value={disbursements.AuthoritiesID}
          onChange={handleChange}
          inputProps={{
            name: "AuthoritiesID",
          }}
        >
          <option aria-label="None" value="">
          {authoritiys?.FirstName} 
          </option>
        </Select>
             </FormControl>
    </Grid>
    <Grid item xs={4}>
    <FormControl fullWidth variant="outlined">
        <p>ชื่อยา</p>
        <Select
          native
          value={medicinestorages.ID}
          onChange={handleChangeMedic}
          inputProps={{
            name: "MedicineStorageID",
          }}
        >
          <option aria-label="None" value="">
          
          </option>
          {medicinestorage.map((item: MedicinestorageInterface) => (
            <option value={item.ID} key={item.ID}>
              {item.Name}
            </option>
          ))}
        </Select>
        </FormControl>
    </Grid>
    <Grid item xs={4}>
    <FormControl fullWidth variant="outlined" disabled>
        <p>ประเภทยา</p>
        <Select
          native
          value={medicinetypeID}
          onChange={handleChange}
          inputProps={{
            name: "medicinetypeID",
          }}
        >
          <option aria-label="None" value="">
          </option>
          {medicinetype.map((item: MedicinetypeInterface) => (
            <option value={item.ID} key={item.ID}>
              {item.Name}
            </option>
          ))}
        </Select>
        </FormControl>
    </Grid>
    <Grid item xs={4}>
    <p>จำนวนยา</p>
        <FormControl fullWidth variant="outlined">
        <TextField
          id="AmountMedicine"
          variant="outlined"
          type="number"
          size="medium"
          value={disbursements.AmountMedicine || ""}
          onChange={handleInputChange}
          />
        </FormControl>
    </Grid> 
    <Grid item xs={4}>
    <FormControl fullWidth variant="outlined">
        <p>ห้องยา</p>
        <Select
          native
          value={disbursements.MedicineRoomID}
          onChange={handleChange}
          inputProps={{
            name: "MedicineRoomID",
          }}
        >
          <option aria-label="None" value="">
          </option>
          {medicinerooms.map((item: MedicineRoomInterface) => (
            <option value={item.ID} key={item.ID}>
              {item.Name}
            </option>
          ))}
        </Select>
        </FormControl>
        </Grid>
    <Grid item xs={4}>
    <FormControl fullWidth variant="outlined">
        <p>วันที่เบิกยา</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="WatchedTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
        </FormControl>
        </Grid>
        <Grid item xs={4}>
        
         </Grid>
         <Grid item xs={4}>
      <FormControl className={classes.formControl} >
        
      </FormControl>
         </Grid>
        <Grid item xs={7}>
        <Button
              component={RouterLink}
              to="/disbursements"
              style={{ float: "left" }}
              variant="contained"
              color="primary"
            >
              ใบเบิกยา
            </Button>
        </Grid>
        <Grid item xs={5}>
        <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="secondary"
            >
              ยืนยันการเบิกยา
            </Button>
        </Grid> 
    </Grid> 
    </Paper>
</Container>
    );
  }
  export default  Medicine_disbursementCreate;