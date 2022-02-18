import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { BillsInterface } from "../models/IBill";
import { format } from 'date-fns'
import { IconButton, Snackbar } from "@material-ui/core";

import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

import React from "react";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  })
);

function Bills() {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState("");
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  const [bills, setBills] = useState<BillsInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
  const getBills = async () => {
    fetch(`${apiUrl}/bills`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setBills(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const DeleteBill = async (id: string | number | undefined) => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    fetch(`${apiUrl}/bills/${id}`, requestOptions)
    .then((response) => response.json())
    .then(
      (res) => {
        if (res.data) {
          setSuccess(true)
          console.log("ยกเลิกสำเร็จ")
          setErrorMessage("")
        } 
        else { 
          setErrorMessage(res.error)
          setError(true)
          console.log("ยกเลิกไม่สำเร็จ")
        }  
        getBills(); 
      }
    )
  }

  useEffect(() => {
    getBills();
  }, []);

  return (
    <div>
      <Container className={classes.container} maxWidth="xl">
        <Box display="flex">
          <Box flexGrow={1}>

          <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
              ยกเลิกชำระเงินค่ายาสำเร็จ
              </Alert>
            </Snackbar>

            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                {ErrorMessage}
              </Alert>
            </Snackbar>
            <br/><br/> 

            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom>
              ข้อมูลการชำระเงินค่ายา
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/bill/create"
              variant="contained"
              color="primary"
              style={{ backgroundColor: '#4682B4', fontSize: 'verdana', color: '#ffffff' }}>
              <ArrowBackTwoToneIcon/>
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
              <TableCell align="center" width="7%">
                  รหัสชำระเงิน
              </TableCell>
                <TableCell align="center" width="2%">
                  ชื่อยา
                </TableCell>
                <TableCell align="center" width="6%">
                ราคายาต่อหน่วย(บาท)
                </TableCell>
                <TableCell align="center" width="5%">
                จำนวนยา
                </TableCell>
                <TableCell align="center" width="7%">
                  ราคารวม
                </TableCell>
                <TableCell align="center" width="2%">
                รหัสใบสั่งยา
                </TableCell>
                <TableCell align="center" width="5%">
                  ชื่อผู้ชำระเงิน
                </TableCell>
                <TableCell align="center" width="8%">
                    รูปแบบการชำระเงิน
                </TableCell>
                <TableCell align="center" width="8%">
                  วันที่และเวลาสั่งยา
                </TableCell>
                <TableCell align="center" width="8%">
                  วันที่และเวลาชำระเงิน
                </TableCell>
                <TableCell align="center" width="7%">
                  ผู้ให้ชำระเงิน
                </TableCell>
                <TableCell align="center" width="6%">
                  ยกเลิกการชำระเงิน
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((item: BillsInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.BillNo}</TableCell>
                  <TableCell align="center">{item.Prescription.MedicineDisbursement.MedicineStorage.Name}</TableCell>
                  <TableCell align="center">{item.Prescription.MedicineDisbursement.MedicineStorage.Sell}</TableCell>
                  <TableCell align="center">{item.Prescription.Amount}</TableCell>
                  <TableCell align="center">{item.Total + " บาท"}</TableCell>
                  <TableCell align="center">{item.Prescription.PrescriptionNo}</TableCell>
                  <TableCell align="center">{item.Payer}</TableCell>
                  <TableCell align="center">{item.Paymentmethod.ConditionsOfPayments}</TableCell>
                  <TableCell align="center">{format((new Date(item.Prescription.RecordingTime)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                  <TableCell align="center">{format((new Date(item.BillTime)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                  <TableCell align="center">{item.Authorities.FirstName}</TableCell>
                  <TableCell align="center"> 
                  <IconButton aria-label="delete" onClick={() => DeleteBill(item.ID)}><CancelTwoToneIcon/></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default Bills;
