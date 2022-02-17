import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Medicine_disbursementInterface } from "../models/IMedicine_disbursement";
import moment from 'moment';
import { format } from "date-fns";
import { Link as RouterLink } from "react-router-dom";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
 createStyles({
   container: {marginTop: theme.spacing(2),width: 1500},
   table: { minWidth: 650},
   tableSpace: {marginTop: 20},
 })
);

function Medicine_disbursement() {
    const classes = useStyles();
    const [disbursements, setdisbursements] = useState<Medicine_disbursementInterface[]>([]);   

    const getdisbursements = async () => {  
      const apiUrl = "http://localhost:8080/disbursements";   
      const requestOptions = { 
        method: "GET", 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }, 
      };

      

      fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setdisbursements(res.data);
          } else {
            console.log("else");
          }
        });
    };
   
    useEffect(() => {
      getdisbursements();
   
    }, []);
   
    return (
      <div>
        <Container className={classes.container}>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                ใบเบิกยา
              </Typography>
            </Box>
            <Box>
            <Button
              component={RouterLink}
              to="/disbursementCreate"
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
                  <TableCell align="center" width="13%">
                    เลขใบเบิกยา
                  </TableCell>
                  <TableCell align="center" width="17%">
                    ชื่อผู้เบิก
                  </TableCell>
                  <TableCell align="center" width="15%">
                    ชื่อยา
                  </TableCell>
                  <TableCell align="center" width="10%">
                    จำนวนยา
                  </TableCell>
                  <TableCell align="center" width="15%">
                    ประเภทยา
                  </TableCell>
                  <TableCell align="center" width="15%">
                    ห้องยา
                  </TableCell>
                  <TableCell align="center" width="15%">
                    วันที่เบิกยา
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {disbursements.map((temp: Medicine_disbursementInterface) => (
                  <TableRow key={temp.ID}>
                    <TableCell align="center">{temp.DisbursementID}</TableCell>
                    <TableCell align="center" size="medium">{temp.Authorities.FirstName}</TableCell>
                    <TableCell align="center">{temp.MedicineStorage.Name}</TableCell>
                    <TableCell align="center">{temp.AmountMedicine}</TableCell>
                    <TableCell align="center">{temp.MedicineStorage.MedicineType.Name}</TableCell>
                    <TableCell align="center">{temp.MedicineRoom.Name}</TableCell>
                    <TableCell align="center">{moment(temp.DisbursementDAY).format("DD/MM/YYYY")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </div>
    );
   }
   
    
   
   export default Medicine_disbursement;