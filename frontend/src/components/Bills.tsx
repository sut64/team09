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

  useEffect(() => {
    getBills();
  }, []);

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ข้อมูลการชำระเงินค่ายา
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/bill/create"
              variant="contained"
              color="primary"
            >
              ระบบชำระเงินค่ายา
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="2%">
                  ลำดับ
                </TableCell>
                <TableCell align="center" width="2%">
                  เลขใบสั่งยา
                </TableCell>
                <TableCell align="center" width="5%">
                ราคายา
                </TableCell>
                <TableCell align="center" width="3%">
                จำนวนยา
                </TableCell>
                <TableCell align="center" width="5%">
                  ราคารวม
                </TableCell>
                <TableCell align="center" width="7%">
                  ชื่อผู้ชำระเงิน
                </TableCell>
                <TableCell align="center" width="10%">
                    รูปแบบการชำระเงิน
                </TableCell>
                <TableCell align="center" width="10%">
                  วันที่และเวลา
                </TableCell>
                <TableCell align="center" width="4%">
                  เลขใบชำระเงิน
                </TableCell>
                <TableCell align="center" width="6%">
                  ผู้ให้ชำระเงิน
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((item: BillsInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.ID}</TableCell>
                  <TableCell align="center">{item.Prescription.PrescriptionNo}</TableCell>
                  <TableCell align="center">{item.Prescription.MedicineDisbursement.MedicineStorage.Sell}</TableCell>
                  <TableCell align="center">{item.Prescription.Amount}</TableCell>
                  <TableCell align="center">{item.Total}</TableCell>
                  <TableCell align="center">{item.Payer}</TableCell>
                  <TableCell align="center">{item.Paymentmethod.ConditionsOfPayments}</TableCell>
                  <TableCell align="center">{format((new Date(item.BillTime)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                  <TableCell align="center">{item.BillNo}</TableCell>
                  <TableCell align="center">{item.Authorities.FirstName}</TableCell>
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
