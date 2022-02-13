import React, { useEffect, useState } from "react";

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

import { Medicine_receiveInterface } from "../models/IMedicine_receive";


 
import moment from 'moment';
 
 
const useStyles = makeStyles((theme: Theme) =>
 createStyles({
   container: {marginTop: theme.spacing(2)},
   table: { minWidth: 650},
   tableSpace: {marginTop: 20},
 })
);
 
function Users() {
 const classes = useStyles();
 const [mreceive, setMreceive] = useState<Medicine_receiveInterface[]>([]);
 const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getMedicinereceives = async () => {
    fetch(`${apiUrl}/medicinereceives`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setMreceive(res.data);
          console.log(res.data);
        } else {
          console.log("else");
        }
      });
  };
  
  useEffect(() => {
    
    getMedicinereceives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 return (
   <div>
     <Container className={classes.container} maxWidth="xl">
       <Box display="flex">
         <Box flexGrow={1}>
           <Typography
             component="h2"
             variant="h6"
             color="primary"
             gutterBottom
           >
             คลังยา
           </Typography>
         </Box>
         <Box>
           <Button
             component={RouterLink}
             to="/receive"
             variant="contained"
             color="primary"
           >
             Receive
           </Button>
         </Box>
       </Box>
       <TableContainer component={Paper} className={classes.tableSpace}>
         <Table className={classes.table} aria-label="simple table">
           <TableHead>
             <TableRow>
               <TableCell align="center" width="5%">
                 ผู้รับยา
               </TableCell>
               <TableCell align="center" width="5%">
                 ชื่อยา
               </TableCell>
               <TableCell align="center" width="5%">
                 ประเภทยา
               </TableCell>
               <TableCell align="center" width="5%">
                 จำนวนรับยา
               </TableCell>
               <TableCell align="center" width="5%">
                 หน่วยที่รับมา
               </TableCell>
               <TableCell align="center" width="5%">
                 ราคาต่อหน่วย
               </TableCell>
               <TableCell align="center" width="5%">
                 วันที่รับ
               </TableCell>
               <TableCell align="center" width="5%">
                 วันหมดอายุ
               </TableCell>
               <TableCell align="center" width="5%">
                 หน่วยงาน
               </TableCell>
               <TableCell align="center" width="5%">
                 องกรค์
               </TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
              {mreceive.map((user: Medicine_receiveInterface) => (
                <TableRow key={user.ID}>
                  <TableCell align="center">{user.Authorities.FirstName} {user.Authorities.LastName}</TableCell>
                  <TableCell align="center">{user.MedicineStorage.Name}</TableCell>
                  <TableCell align="center">{user.MedicineStorage.MedicineType.Name}</TableCell>
                  <TableCell align="center">{user.Count}</TableCell>
                  <TableCell align="center">{user.Packing.Name}</TableCell>
                  <TableCell align="center">{user.Price_of_unit}</TableCell>
                  <TableCell align="center" >{moment(user.Receiveddate).format('D/M/YYYY [เวลา] h:mm:ss a')}</TableCell>
                  <TableCell align="center">{moment(user.Receiveddate).format('D/M/YYYY')}</TableCell>
                  <TableCell align="center">{user.Company}</TableCell>
                  <TableCell align="center">{user.ReceiveType.Name}</TableCell>               
                </TableRow>
              ))}
            </TableBody>
         </Table>
       </TableContainer>
     </Container>
   </div>
 );
}
 
export default Users;
