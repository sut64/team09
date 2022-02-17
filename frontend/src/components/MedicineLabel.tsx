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
import { MedicineLabelsInterface } from "../models/IMedicineLabel";
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

function MedicineLabels() {
  const classes = useStyles();
  const [medicineLabels, setAmbulances] = useState<MedicineLabelsInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getMedicineLabels = async () => {
    fetch(`${apiUrl}/medicineLabels`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        // console.log(res.data);
        if (res.data) {
          setAmbulances(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {//สั่งให้ react ดึงข้อมูลจาก API ที่เราสร้างขึ้นมา
    getMedicineLabels();
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
              ข้อมูลฉลากยา
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/medicineLabels/create"
              variant="contained"
              color="primary"
            >
              สร้างข้อมูล
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="10%">
                  ชื่อยา
                </TableCell>
                <TableCell align="center" width="14%">
                  สรรพคุณยา
                </TableCell>
                <TableCell align="center" width="14%">
                  วิธีใช้ยา
                </TableCell>
                <TableCell align="center" width="10%">
                  ทานครั้งละ
                </TableCell>
                <TableCell align="center" width="14%">
                  คำแนะนำ
                </TableCell>
                <TableCell align="center" width="13%">
                  ผลข้างเคียง
                </TableCell>
                <TableCell align="center" width="15%">
                  วันที่บันทึก
                </TableCell>
                <TableCell align="center" width="10%">
                  ผู้บันทึก
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicineLabels.map((medicineLabel: MedicineLabelsInterface) => (
                <TableRow key={medicineLabel.ID}>
                  <TableCell align="center">{medicineLabel.MedicineDisbursement.MedicineStorage.Name}</TableCell>
                  <TableCell align="center">{medicineLabel.Property}</TableCell>
                  <TableCell align="center">{medicineLabel.Instruction}</TableCell>
                  <TableCell align="center">{medicineLabel.Consumption}</TableCell>
                  <TableCell align="center">{medicineLabel.Suggestion.SuggestionName}</TableCell>
                  <TableCell align="center">{medicineLabel.Effect.EffectName}</TableCell>
                  <TableCell align="center">{format((new Date(medicineLabel.Date)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                  <TableCell align="center">{medicineLabel.Authorities.FirstName} {medicineLabel.Authorities.LastName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default MedicineLabels;