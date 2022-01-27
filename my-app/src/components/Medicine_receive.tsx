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
             Users
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
                 ID
               </TableCell>
               <TableCell align="center" width="25%">
                 First
               </TableCell>
               <TableCell align="center" width="25%">
                 Last
               </TableCell>
               <TableCell align="center" width="5%">
                 Age
               </TableCell>
               <TableCell align="center" width="20%">
                 Email
               </TableCell>
               <TableCell align="center" width="20%">
                 Birth Day
               </TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             
               <TableRow >
                 <TableCell align="right">B6218805</TableCell>
                 <TableCell align="left" size="medium">
                   sarunyu
                 </TableCell>
                 <TableCell align="left">taiwprasong</TableCell>
                 <TableCell align="left">18</TableCell>
                 <TableCell align="left">Sarunyu77@kon.com</TableCell>
                 <TableCell align="center">{moment().format("DD/MM/YYYY")}</TableCell>
               </TableRow>
             
           </TableBody>
         </Table>
       </TableContainer>
     </Container>
   </div>
 );
}
 
export default Users;
