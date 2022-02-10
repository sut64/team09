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
import { Dispense_MedicineInterface } from "../models/IDispenseMedicine";
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

function Dispense_Medicines() {
  const classes = useStyles();
  const [dispense_medicines, setDispense_Medicines] = useState<Dispense_MedicineInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getDispense_Medicines = async () => {   
    fetch(`${apiUrl}/dispenseMedicines`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setDispense_Medicines(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getDispense_Medicines();
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
              ข้อมูลการจ่ายยา
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/dispense_medicine/create"
              variant="contained"
              color="primary"
            >
              กลับ
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="5%">
                  ลำดับ
                </TableCell>
                <TableCell align="center" width="15%">
                  เลขจ่ายยา
                </TableCell>
                <TableCell align="center" width="15%">
                  ผู้รับยา
                </TableCell>
                <TableCell align="center" width="5%">
                  เลขชำระเงิน
                </TableCell>
                <TableCell align="center" width="15%">
                  ผู้ชำระเงิน
                </TableCell>
                <TableCell align="center" width="15%">
                  สถานะจ่ายยา
                </TableCell>
                <TableCell align="center" width="20%">
                  วันที่และเวลา
                </TableCell>
                <TableCell align="center" width="10%">
                  ผู้ให้จ่ายยา
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dispense_medicines.map((item: Dispense_MedicineInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.ID}</TableCell>
                  <TableCell align="center">{item.DispensemedicineNo}</TableCell>
                  <TableCell align="center">{item.ReceiveName}</TableCell>
                  <TableCell align="center">{item.Bill.BillNo}</TableCell>
                  <TableCell align="center">{item.Bill.Payer}</TableCell>
                  <TableCell align="center">{item.DispenseStatus.Status}</TableCell>
                  <TableCell align="center">{format((new Date(item.DispenseTime)), 'dd MMMM yyyy hh:mm a')}</TableCell>
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

export default Dispense_Medicines;
