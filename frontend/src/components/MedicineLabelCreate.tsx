import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
  alpha,
} from "@material-ui/core/styles";
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
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { AuthoritiesInterface } from "../models/IAuthority"
import { Medicine_disbursementInterface } from "../models/IMedicine_disbursement";
import { SuggestionsInterface } from "../models/ISuggestion";
import { EffectsInterface } from "../models/IEffect";
import { MedicineLabelsInterface } from "../models/IMedicineLabel";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
//import { isTypeAssertionExpression } from "typescript";
import { TextField } from "@material-ui/core";

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

function AmbulanceCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [users, setUsers] = useState<AuthoritiesInterface>();
  const [medicine_disbursements, setMedicineDisbursements] = useState<Medicine_disbursementInterface[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionsInterface[]>([]);
  const [effects, setEffects] = useState<EffectsInterface[]>([]);
  const [medicineLabel, setMedicineLabel] = useState<Partial<MedicineLabelsInterface>>(
    {}
  );

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
  //เอาไปใช้กับ Textbox
  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const name = event.target.id as keyof typeof medicineLabel;
    setMedicineLabel({
      ...medicineLabel,
      [name]: event.target.value,
    });
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
    const name = event.target.name as keyof typeof medicineLabel;
    setMedicineLabel({
      ...medicineLabel,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };
  const getUsers = async () => {
    let uid = localStorage.getItem("uid")
    fetch(`${apiUrl}/authority/${uid}`, requestOptions) //Get โดยส่งพารามิเตอร์
      .then((response) => response.json())
      .then((res) => {
        medicineLabel.AuthoritiesID = res.data.ID
        if (res.data) {
          setUsers(res.data);
        } else {
          console.log("else");
        }
      });
  };
  
  const getMedicines = async () => {
    fetch(`${apiUrl}/listMedicine`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if(res.data){
          setMedicineDisbursements(res.data);
        } else {
          console.log("else");
        }
      });
  };
  const getSuggestion = async () => {
    fetch(`${apiUrl}/suggestions`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuggestions(res.data);
        } else {
          console.log("else");
        }
      });
  };
  const getEffect = async () => {
    fetch(`${apiUrl}/effects`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setEffects(res.data);
        } else {
          console.log("else");
        }
      });
  };
  useEffect(() => { //สั่งให้ react ดึงข้อมูลจาก API ที่เราสร้างขึ้นมา
    getUsers();
    getMedicines();
    
    getSuggestion();
    getEffect();
  }, []);
  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };
  function submit() {
    let data = {
      MedicineDisbursementID: convertType(medicineLabel.MedicineDisbursementID),
      Instruction: medicineLabel.Instruction ?? "",
      Property: medicineLabel.Property ?? "",
      Consumption: medicineLabel.Consumption ?? "",
      SuggestionID: convertType(medicineLabel.SuggestionID),
      EffectID: convertType(medicineLabel.EffectID),
      AuthoritiesID: convertType(medicineLabel.AuthoritiesID),
      Date: selectedDate,
    };
    // console.log(data)

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(`${apiUrl}/medicineLabels`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          // console.log("บันทึกได้")
          setSuccess(true);
          setErrorMessage("")
        } else {
          // console.log("บันทึกไม่ได้")
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
          บันทึกข้อมูลไม่สำเร็จ :{errorMessage}
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
              บันทึกข้อมูลฉลากยา
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อยา</p>
              <Select
                native
                value={medicineLabel.MedicineDisbursementID}
                onChange={handleChange}
                inputProps={{
                  name: "MedicineDisbursementID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกชื่อยา
                </option>
                {medicine_disbursements.map((item: Medicine_disbursementInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.MedicineStorage.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>สรรพคุณยา</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Property"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="กรุณากรอกข้อมูลสรรพคุณของยยา"
                  value={medicineLabel.Property || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วิธีใช้</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Instruction"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="กรุณากรอกข้อมูลวิธีการใช้ยา"
                  value={medicineLabel.Instruction || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ทานครั้งละ</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Consumption"
                  variant="outlined"
                  type="number"
                  size="medium"
                  placeholder="กรุณากรอกข้อมูลการบริโภค"
                  value={medicineLabel.Consumption || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>คำแนะนำ</p>
              <Select
                native
                value={medicineLabel.SuggestionID}
                onChange={handleChange}
                inputProps={{
                  name: "SuggestionID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกคำแนะนำ
                </option>
                {suggestions.map((item: SuggestionsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.SuggestionName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผลข้างเคียง</p>
              <Select
                native
                value={medicineLabel.EffectID}
                onChange={handleChange}
                inputProps={{
                  name: "EffectID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกผลข้างเคียงยา
                </option>
                {effects.map((item: EffectsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.EffectName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="กรุณาเลือกวันที่และเวลา"
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/medicineLabels"
              variant="contained"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
export default AmbulanceCreate;