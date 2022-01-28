import React, { useEffect } from "react";
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

 
import moment from 'moment';
import { PrescriptionInterface } from "../models/IPrescription";
 
 
const useStyles = makeStyles((theme: Theme) =>
 createStyles({
   container: {marginTop: theme.spacing(2)},
   table: { minWidth: 650},
   tableSpace: {marginTop: 20},
 })
);
 
function Prescriptions() {
 const classes = useStyles();
 const [prescriptions, setPrescriptions] = React.useState<PrescriptionInterface[]>([]);
 
 const getUsers = async () => {
   const apiUrl = "http://localhost:8080/Prescriptions";
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
         setPrescriptions(res.data);
       } else {
         console.log("else");
       }
     });
 };
 
 useEffect(() => {
   getUsers();
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
             ประวัติการสั่งยา
           </Typography>
         </Box>
         {/* <Box>
           <Button
             component={RouterLink}
             to="/create"
             variant="contained"
             color="primary"
           >
             Create User
           </Button>
         </Box> */}
       </Box>
       <TableContainer component={Paper} className={classes.tableSpace}>
         <Table className={classes.table} aria-label="simple table">
           <TableHead>
             <TableRow>
               <TableCell align="center" width="10%">
                 เลขที่ใบสั่งยา
               </TableCell>
               <TableCell align="center" width="20%">
                 ผู้ป่วย
               </TableCell>
               <TableCell align="center" width="20%">
                 ชื่อยา
               </TableCell>
               <TableCell align="center" width="8%">
                 จำนวนยา
               </TableCell>
               <TableCell align="center" width="20%">
                 ผู้สั่งยา
               </TableCell>
               <TableCell align="center" width="22%">
                 วันเวลาทำรายการ
               </TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {prescriptions.map((prescript: PrescriptionInterface) => (
               <TableRow key={prescript.ID}>
                 <TableCell align="right">{prescript.PrescriptionNo}</TableCell>
                 <TableCell align="left" size="medium">
                   {prescript.PatientName}
                 </TableCell>
                 <TableCell align="left">{prescript.MedicineRoom.Name}</TableCell>
                 <TableCell align="left">{prescript.Amount}</TableCell>
                 <TableCell align="left">{prescript.Authorities.FirstName} {prescript.Authorities.LastName}</TableCell>
                 <TableCell align="center">{moment(prescript.RecordingTime).format("DD/MM/YYYY hh:mm:ss a")}</TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </TableContainer>
     </Container>
   </div>
 );
}
 
export default Prescriptions;