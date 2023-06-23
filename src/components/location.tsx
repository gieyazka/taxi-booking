import * as React from "react";

import {
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  Portal,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  DirectionsRenderer,
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
import RemoveIcon from "@mui/icons-material/Remove";
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
      passenger: !data.hasOwnProperty("passenger")
        ? [{ name: "" }]
        : data.passenger,
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
  // const onStartPlacesChanged = () => {
  //   console.log(startPlaceRef!.current);

  //   let origin = startPlaceRef.current && startPlaceRef.current.getPlaces();
  //   // console.log(origin[0]);

  //   let lat = origin[0].geometry.location.lat();
  //   let lng = origin[0].geometry.location.lng();
  //   let name = origin[0].name;
  //   // console.log(lat,lng);
  //   setValue("plocation", name);
  //   setValue("platitude", lat);
  //   setValue("plongtitude", lng);
  //   // startPlace.current = {
  //   //   lat,
  //   //   lng,
  //   // };
  // };
  // const onEndPlacesChanged = () => {
  //   let destLocation = endPlaceRef.current && endPlaceRef.current.getPlaces();
  //   let lat = destLocation[0].geometry.location.lat();
  //   let lng = destLocation[0].geometry.location.lng();
  //   let name = destLocation[0].name;

  //   setValue("dlocation", name);
  //   setValue("dlatitude", lat);
  //   setValue("dlongtitude", lng);
  //   // endPlace.current = {
  //   //   lat,
  //   //   lng,
  //   // };
  // };
  const onSearchPlacesChanged = () => {
    let destLocation = endPlaceRef.current && endPlaceRef.current.getPlaces();
    let lat = destLocation[0].geometry.location.lat();
    let lng = destLocation[0].geometry.location.lng();
    let name = destLocation[0].name;
    setSearch(
      new google.maps.LatLng({
        lat: lat,
        lng: lng,
      })
    );
    map.moveCamera({
      center: {
        lat: lat,
        lng: lng,
      },
      zoom: 14,
    });
  };
  // console.log(data);
  const [clickMap, setClickMap] = React.useState<{
    open: boolean;
    location?: google.maps.LatLng;
  }>({ open: false });
  const [posMouse, setPosMouse] = React.useState<{ x?: number; y?: number }>();

  const handleClickAway = () => {
    setClickMap((prev) => {
      return {
        open: false,
      };
    });
  };
  const [searchData, setSearch] = React.useState<google.maps.LatLng>();
  const [map, setMap] = React.useState<any>(null);
  const onMapClick = (args: google.maps.MapMouseEvent) => {
    var mouseEvent: MouseEvent = args.domEvent as MouseEvent;
    setPosMouse({
      x: mouseEvent.clientX + mouseEvent.view!.scrollX,
      y: mouseEvent.clientY + mouseEvent.view!.scrollY,
    });

    setClickMap((prev) => {
      return { open: true, location: args.latLng as google.maps.LatLng };
    });
    // console.log("onClick args: ", args.latLng?.lat());
  };
  const [location, setLocation] = React.useState<{
    start?: google.maps.LatLng;
    end?: google.maps.LatLng;
  }>();
  React.useEffect(() => {
    setLocation((prev) => {
      
      
      return {
        start:
          data.platitude !== undefined && data.plongtitude !== undefined
            ? new google.maps.LatLng({
                lat: parseFloat(data.platitude),
                lng: parseFloat(data.plongtitude),
              })
            : undefined,
        end:
          data.dlatitude !== undefined && data.dlongtitude !== undefined
            ? new google.maps.LatLng({
                lat: parseFloat(data.dlatitude),
                lng: parseFloat(data.dlongtitude),
              })
            : undefined,
      };
    });
  }, []);

  const onClickSetLocation = (type: String) => {
    if (type === "start") {
      setValue("platitude", clickMap.location!.lat()!.toString());
      setValue("plongtitude", clickMap.location!.lng()!.toString());
      originRef.current.focus();
      setLocation((prev) => {
        return { ...prev, start: clickMap.location };
      });
    } else {
      // setValue("dlocation", "name");
      setValue("dlatitude", clickMap.location!.lat()!.toString());
      setValue("dlongtitude", clickMap.location!.lng()!.toString());
      destinationRef.current.focus();
      setLocation((prev) => {
        return { ...prev, end: clickMap.location };
      });
    }
    handleClickAway();
  };

  const [userLocation, setUserLocation] = React.useState<{
    lat?: number;
    lng?: number;
  }>();
  const onLoadMap = React.useCallback(async function callback(
    map: google.maps.Map
  ) {
    if (map) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            map.moveCamera({
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              zoom: 12,
            });
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            map.moveCamera({
              center: { lat: 15.24, lng: 100.523 },
              zoom: 9,
            });
          }
        );
      } else {
        map.moveCamera({
          center: { lat: 15.24, lng: 100.523 },
          zoom: 9,
        });
      }
    }
    setMap(map);
  },
  []);

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
                  label="Request ID / หมายเลขคำขอ"
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
                      label="Date / วันที่"
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
                          type: "email",
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
                      label="Tel / เบอร์โทรศัพท์"
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
                      required
                      id="firstName"
                      name="firstName"
                      label="First name/ ชื่อ"
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
                      required
                      id="lastName"
                      name="lastName"
                      label="Last name / นามสกุล"
                      fullWidth
                      autoComplete="family-name"
                      variant="standard"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <GoogleMap
                      // required
                      id="direction-example"
                      // required
                      mapContainerStyle={{
                        height: "35vh",
                        width: "100%",
                        marginBottom: "4px",
                      }}
                      // required
                      zoom={14}
                      // required
                      //@ts-ignored
                      initialCenter={{
                        lat: 15.24,
                        lng: 100.523,
                      }}
                      // optional
                      onClick={onMapClick}
                      // optional
                      onLoad={(map) => {
                        onLoadMap(map);
                      }}
                      // optional
                      onUnmount={(map) => {
                        // console.log("DirectionsRenderer onUnmount map: ", map);
                      }}
                    >
                      <StandaloneSearchBox
                      
                        onLoad={onEndSearchLoad}
                        onPlacesChanged={onSearchPlacesChanged}
                      >
                        <TextField
                          onClick={() => handleClickAway()}
                          style={{
                            width: "24vw",
                            position: "absolute",
                            backgroundColor: "white",
                            textOverflow: `ellipses`,
                            top: "8px",
                            left: "60%",
                            transform: " translateX(-60%)",
                          }}
                          id="Search"
                          name="Search"
                          label="Search / ค้นหา"
                        />
                      </StandaloneSearchBox>

                      {userLocation !== undefined &&
                        userLocation?.lat !== undefined &&
                        userLocation?.lng !== undefined && (
                          <Marker
                            position={
                              new google.maps.LatLng({
                                lat: userLocation?.lat,
                                lng: userLocation?.lng,
                              })
                            }
                            key="Your location"
                            // label="Your location"
                          />
                        )}
                      {clickMap.open && clickMap.location !== undefined && (
                        <Marker
                          position={clickMap.location}
                          key="Click location"
                          // label={{
                          //   text: "Select Location",
                          //   color: "white",
                          // }}
                          icon={{
                            path: "M19.5 10.5C19.5 17.642 12 21.75 12 21.75C12 21.75 4.5 17.642 4.5 10.5C4.5 8.51088 5.29018 6.60322 6.6967 5.1967C8.10322 3.79018 10.0109 3 12 3C13.9891 3 15.8968 3.79018 17.3033 5.1967C18.7098 6.60322 19.5 8.51088 19.5 10.5V10.5Z",
                            fillColor: "orange",
                            fillOpacity: 1,
                            strokeWeight: 0,
                            rotation: 0,
                            scale: 2,
                            anchor: new google.maps.Point(15, 25),

                            labelOrigin: new google.maps.Point(12, 12),
                          }}
                        />
                      )}
                      {searchData !== undefined && (
                        <Marker position={searchData} key="Click location" />
                      )}
                      {location?.end !== undefined && (
                        <Marker
                          position={location?.end}
                          key="eCord"
                          label={{
                            text: "End",
                            color: "white",
                          }}
                          icon={{
                            path: "M19.5 10.5C19.5 17.642 12 21.75 12 21.75C12 21.75 4.5 17.642 4.5 10.5C4.5 8.51088 5.29018 6.60322 6.6967 5.1967C8.10322 3.79018 10.0109 3 12 3C13.9891 3 15.8968 3.79018 17.3033 5.1967C18.7098 6.60322 19.5 8.51088 19.5 10.5V10.5Z",
                            // path: "M10.453 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                            fillColor: "red",
                            fillOpacity: 1,
                            strokeWeight: 0,
                            rotation: 0,
                            scale: 3,
                            anchor: new google.maps.Point(15, 25),

                            labelOrigin: new google.maps.Point(12, 12),
                          }}
                        />
                      )}

                      {location?.start !== undefined && (
                        <Marker
                          position={location?.start}
                          key="sCord"
                          label={{
                            text: "Start",
                            color: "white",
                          }}
                          icon={{
                            path: "M19.5 10.5C19.5 17.642 12 21.75 12 21.75C12 21.75 4.5 17.642 4.5 10.5C4.5 8.51088 5.29018 6.60322 6.6967 5.1967C8.10322 3.79018 10.0109 3 12 3C13.9891 3 15.8968 3.79018 17.3033 5.1967C18.7098 6.60322 19.5 8.51088 19.5 10.5V10.5Z",
                            // path: "M10.453 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                            fillColor: "green",
                            fillOpacity: 1,
                            strokeWeight: 0,
                            rotation: 0,
                            scale: 3,
                            anchor: new google.maps.Point(15, 25),

                            labelOrigin: new google.maps.Point(12, 12),
                          }}
                        />
                      )}
                    </GoogleMap>

                    {clickMap.open ? (
                      <Portal>
                        <Box
                          sx={{
                            position: "absolute",
                            width: "auto",
                            left:
                              posMouse?.x !== undefined ? posMouse?.x + 20 : 0,
                            top: posMouse?.y !== undefined ? posMouse?.y : 0,
                            zIndex: 999,
                            border: "1px solid",
                            borderRadius: "8px",
                            // p: '0px 1px',
                            bgcolor: "background.paper",
                          }}
                        >
                          <p
                            className="hover:bg-gray-500 cursor-pointer p-2"
                            onClick={() => onClickSetLocation("start")}
                          >
                            Set Start Location
                          </p>
                          <hr />
                          <p
                            className="hover:bg-gray-500 cursor-pointer p-2"
                            onClick={() => onClickSetLocation("end")}
                          >
                            Set Destination Location
                          </p>
                        </Box>
                      </Portal>
                    ) : null}
                  </Box>
                </ClickAwayListener>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="plocation"
                  control={control}
                  //@ts-ignored
                  rules={{ required: true }}
                  render={({ field }) => (
                    // <StandaloneSearchBox
                    //   onLoad={onStartSearchLoad}
                    //   onPlacesChanged={onStartPlacesChanged}
                    // >
                    <TextField
                      {...field}
                      inputRef={originRef}
                      // {...register("plocation", { required: true })}
                      // defaultValue={data.plocation || ""}
                      required
                      id="plocation"
                      name="plocation"
                      label="Pickup location / ชื่อสถานที่รับ"
                      fullWidth
                      // placeholder="Pickup location / ชื่อสถานที่รับ"
                      variant="standard"
                    />
                    // </StandaloneSearchBox>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* <StandaloneSearchBox
                  onLoad={onEndSearchLoad}
                  onPlacesChanged={onEndPlacesChanged}
                > */}
                <TextField
                  {...register("dlocation", { required: true })}
                  defaultValue={data.dlocation || ""}
                  required
                  id="dlocation"
                  name="dlocation"
                  label="Destination location / ชื่อสถานที่ส่ง"
                  fullWidth
                  inputRef={destinationRef}
                  // placeholder="Destination location / ชื่อสถานที่ส่ง"
                  variant="standard"
                />
                {/* </StandaloneSearchBox> */}
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <TextField
                  {...register("dlatitude", { required: true })}
                  defaultValue={data.dlatitude || ""}
                  id="dlatitude"
                  name="dlatitude"
                  label="Destination latitude / ละติจูดสถานที่ส่ง"
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
                  label="Destination longtitude / ลองจิจูดสถานที่ส่ง"
                  fullWidth
                  autoComplete="shipping address-line1"
                  variant="standard"
                />
              </Grid> */}

              {fields.map((item, index) => {
                // console.log(item);

                return (
                  <Grid item xs={12} sm={12} key={item.id}>
                    <div style={{ display: "flex" }}>
                      <Controller
                        render={({ field }) => (
                          <TextField
                            {...field}
                            // defaultValue={item.name}
                            // required

                            id="passenger"
                            label="Passenger / ผู้โดยสาร"
                            fullWidth
                            variant="standard"
                          />
                        )}
                        name={`passenger.${index}.name`}
                        control={control}
                      />
                      <AddIcon
                        className={`mt-4 hover:bg-gray-200 rounded-md   ${
                          index !== 0 ? "ml-2" : "ml-10"
                        }`}
                        onClick={() => append({ name: `` })}
                      />
                      {index !== 0 && (
                        <RemoveIcon
                          className="mt-4 hover:bg-gray-200 rounded-md ml-2"
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      )}
                    </div>
                  </Grid>
                );
              })}

              <Grid item xs={12} sm={12}>
                <TextField
                  {...register("remark")}
                  multiline
                  rows={4}
                  // defaultValue={data.plongtitude || ""}
                  id="remark"
                  name="remark"
                  label="Remark / หมายเหตุ"
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
