import * as React from "react";

import { Box, Button, FormControl } from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  DirectionsRenderer,
  DirectionsService,
  DistanceMatrixService,
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";
import { formData, userEGAT } from "../interface";

import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import CheckScript from "./checkScrip";
import Checkbox from "@mui/material/Checkbox";
import { DataArray } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function AddressForm({
  allUser,
  data,
  handleSubmitForm,
  setData,
}: {
  allUser: userEGAT[];
  // allUser : {id : number,firstname : string,lastname:string,email : string,phone_number : string}
  setData: React.Dispatch<React.SetStateAction<formData>>;
  data: formData;
  handleSubmitForm: (e: any) => void;
}) {
  const {
    register,
    setValue,
    getValues,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>({
    defaultValues: {
      tel: data.tel || "",
      datetime: data.datetime,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      id: data.id || "",
      plocation: data.plocation || "",
      platitude: data.platitude || "",
      plongtitude: data.plongtitude || "",
      dlocation: data.dlocation || "",
      dlatitude: data.dlatitude || "",
      dlongtitude: data.dlongtitude || "",
      token: data.token || "",
      remark: data.remark || "",
      orgReqID: data.orgReqID || "",
      passenger: !data.hasOwnProperty('passenger') ?[{ name: "" }] : data.passenger,
    },
  });
  
  
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({
      control,
      //@ts-ignored
      name: "passenger",
      // rules: {
      //   required: true,
      // },
    });

  let cloneNewuser = null;
  if (data.email !== undefined) {
    if (allUser.find((d) => d.email === data.email) === undefined) {
      cloneNewuser = {
        email: data.email,
        phone_number: data.tel,
        firstname: data.firstName,
        lastname: data.lastName,
      };
    }
  }
  const startPlaceRef = React.useRef<any>();
  const endPlaceRef = React.useRef<any>();

  const originRef = React.useRef<any>();
  const destinationRef = React.useRef<any>();
  const onStartSearchLoad = (ref: any) => (startPlaceRef.current = ref);
  const onEndSearchLoad = (ref: any) => (endPlaceRef.current = ref);
  const onStartPlacesChanged = () => {
    let origin = startPlaceRef.current && startPlaceRef.current.getPlaces();
    // console.log(origin[0]);

    let lat = origin[0].geometry.location.lat();
    let lng = origin[0].geometry.location.lng();
    let name = origin[0].name;
    // console.log(lat,lng);
    setValue("plocation", name);
    setValue("platitude", lat);
    setValue("plongtitude", lng);
    // startPlace.current = {
    //   lat,
    //   lng,
    // };
  };
  const onEndPlacesChanged = () => {
    let destLocation = endPlaceRef.current && endPlaceRef.current.getPlaces();
    let lat = destLocation[0].geometry.location.lat();
    let lng = destLocation[0].geometry.location.lng();
    let name = destLocation[0].name;

    setValue("dlocation", name);
    setValue("dlatitude", lat);
    setValue("dlongtitude", lng);
    // endPlace.current = {
    //   lat,
    //   lng,
    // };
  };
  // console.log(data);
  
  return (
    <React.Fragment>
      {/* <Typography variant="h6" gutterBottom>
        Booking address
      </Typography> */}
      <CheckScript>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("orgReqID")}
                  defaultValue={data.orgReqID || ""}
                  id="orgReqID"
                  name="orgReqID"
                  label="Request ID / ?????????????????????????????????"
                  fullWidth
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="datetime"
                  control={control}
                  //@ts-ignored
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      ampm={false}
                      label="Date / ??????????????????"
                      value={data.datetime}
                      onChange={(e) => {
                        setValue("datetime", e);
                        setData({ ...data, datetime: e });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="datetime"
                          fullWidth
                          variant="standard"
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue);

                    let newData: userEGAT = newValue;
                    setValue("firstName", newData.firstname);
                    setValue("lastName", newData.lastname);
                    setValue("email", newData.email);
                    setValue("id", newData.id);
                    setValue("tel", newData.phone_number.replace("+66", "0"));
                    setValue("token", newData.token);
                  }}
                  //  inputValue={inputValue}
                  //  onInputChange={(event, newInputValue) => {
                  //    console.log("input"+newInputValue);
                  //    setInputValue(newInputValue);
                  //  }}
                  freeSolo
                  id="email"
                  disableClearable
                  // value={data.email}
                  //@ts-ignored
                  value={
                    cloneNewuser
                      ? [...allUser, cloneNewuser].find(
                          (d) => d.email === data.email
                        ) || null
                      : [...allUser].find((d) => d.email === data.email) || null
                  }
                  options={
                    cloneNewuser
                      ? [...allUser, cloneNewuser]
                      : ([...allUser] as any)
                  }
                  getOptionLabel={(option: any) => {
                    return (option as userEGAT).email;
                  }}
                  renderInput={(params) => {
                    // console.log(params);

                    return (
                      <TextField
                        //
                        // value={allUser.find((d) => d.email === data.email)}
                        {...register("email", { required: true })}
                        name="email"
                        type={"email"}
                        {...params}
                        label="email"
                        InputProps={{
                          ...params.InputProps,
                          type: "search",
                        }}
                        variant="standard"
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="tel"
                  control={control}
                  //@ts-ignored
                  rules={{ required: true, pattern: "[0]{1}[689]{1}[0-9]{8}" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      // value={data.tel || ""}
                      required
                      id="tel"
                      label="Tel / ???????????????????????????????????????"
                      fullWidth
                      placeholder="0912345678"
                      autoComplete="tel"
                      variant="standard"
                      type="tel"
                      // {...register("tel", { required: true })}
                      // onChange={(e)=>setData({...data , tel : e.target.value})}
                      // inputProps={{
                      //   pattern: "[0]{1}[689]{1}[0-9]{8}",
                      // }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstName"
                  control={control}
                  //@ts-ignored
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      // value={data.firstname || ""}
                      // onChange={(e)=>setData({...data , firstname : e.target.value})}
                      required
                      id="firstName"
                      name="firstName"
                      label="First name/ ????????????"
                      fullWidth
                      autoComplete="given-name"
                      variant="standard"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="lastName"
                  control={control}
                  //@ts-ignored
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      // onChange={(e)=>setData({...data , lastname : e.target.value})}
                      // value={data.lastname || ""}
                      required
                      id="lastName"
                      name="lastName"
                      label="Last name / ?????????????????????"
                      fullWidth
                      autoComplete="family-name"
                      variant="standard"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <StandaloneSearchBox
                  onLoad={onStartSearchLoad}
                  onPlacesChanged={onStartPlacesChanged}
                >
                  <TextField
                    ref={originRef}
                    // {...register("plocation", { required: true })}
                    defaultValue={data.plocation || ""}
                    required
                    id="plocation"
                    name="plocation"
                    label="Pickup location / ??????????????????????????????????????????"
                    fullWidth
                    // placeholder="Pickup location / ??????????????????????????????????????????"
                    variant="standard"
                  />
                </StandaloneSearchBox>
              </Grid>
              {/* <Grid item xs={12} sm={6}>
              <TextField
                {...register("platitude", { required: true })}
                defaultValue={data.platitude || ""}
                id="platitude"
                name="platitude"
                label="pickup latitude / ???????????????????????????????????????????????????"
                fullWidth
                autoComplete="shipping address-line2"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("plongtitude", { required: true })}
                defaultValue={data.plongtitude || ""}
                required
                id="plongtitude"
                name="plongtitude"
                label="pickup longtitude / ??????????????????????????????????????????????????????"
                fullWidth
                autoComplete="shipping address-line1"
                variant="standard"
              />
            </Grid> */}

              <Grid item xs={12}>
                <br />
                <hr />
              </Grid>
              <Grid item xs={12} sm={12}>
                <StandaloneSearchBox
                  onLoad={onEndSearchLoad}
                  onPlacesChanged={onEndPlacesChanged}
                >
                  <TextField
                    // {...register("dlocation", { required: true })}
                    defaultValue={data.dlocation || ""}
                    required
                    ref={destinationRef}
                    id="dlocation"
                    name="dlocation"
                    label="Destination location / ??????????????????????????????????????????"
                    fullWidth
                    // placeholder="Destination location / ??????????????????????????????????????????"
                    variant="standard"
                  />
                </StandaloneSearchBox>
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  {...register("dlatitude", { required: true })}
                  defaultValue={data.dlatitude || ""}
                  id="dlatitude"
                  name="dlatitude"
                  label="Destination latitude / ???????????????????????????????????????????????????"
                  fullWidth
                  autoComplete="shipping address-line2"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("dlongtitude", { required: true })}
                  defaultValue={data.dlongtitude || ""}
                  required
                  id="dlongtitude"
                  name="dlongtitude"
                  label="Destination longtitude / ??????????????????????????????????????????????????????"
                  fullWidth
                  autoComplete="shipping address-line1"
                  variant="standard"
                />
              </Grid> */}

              {fields.map((item, index) => {
                // console.log(item);
                
                return (
                  <Grid item xs={12} sm={12} key={item.id}>
                    <div style={{display : 'flex'}}>
                 
                                 <Controller
                render={({ field }) => 
                <TextField
                {...field}
                // defaultValue={item.name}
                // required
        
                id="passenger"
             
                label="Passenger / ???????????????????????????"
                fullWidth
                variant="standard"
              />
              }
                name={`passenger.${index}.name`}
                control={control}
              />
                      <AddIcon className={`mt-4 hover:bg-gray-200 rounded-md   ${index !== 0 ? 'ml-2' : 'ml-10' }`} onClick={() => append({ name: `` })}  />
                      {index !== 0 &&
                      <RemoveIcon className='mt-4 hover:bg-gray-200 rounded-md ml-2' onClick={() =>{
                        
                        remove(index)
                      }}  />
                      }

                    </div>
                  </Grid>
                );
              })}

      
              <Grid item xs={12} sm={12}>
                <TextField
                  {...register("remark")}
                  multiline
                  rows={4}
                  defaultValue={data.plongtitude || ""}
                  id="remark"
                  name="remark"
                  label="Remark / ????????????????????????"
                  fullWidth
                  variant="standard"
                />
              </Grid>

              {/* <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox color="secondary" name="saveAddress" value="yes" />
              }
              label="Use this address for payment details"
            />
          </Grid> */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    // fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Next
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </form>
      </CheckScript>
    </React.Fragment>
  );
}
