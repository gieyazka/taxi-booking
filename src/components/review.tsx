import * as React from "react";

import { DirectionsService, GoogleMap, Marker } from "@react-google-maps/api";
import { formData, userEGAT } from "../interface";

import { Button } from "@mui/material";
import CheckScript from "./checkScrip";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import _ from "lodash";

export default function Review({
  allUser,
  data,
  setData,
  confirmBook,
  handleBack,
}: {
  allUser: userEGAT[];
  setData: React.Dispatch<React.SetStateAction<formData>>;
  data: formData;
  confirmBook: () => void;
  handleBack: () => void;
}) {
  // console.log(data);
  const [center, setCenter] = React.useState(
    new google.maps.LatLng({
      lat: 15.24,
      lng: 100.523,
    })
  );
  const routePolyline = React.useRef<google.maps.Polyline[]>([]);
  const [map, setMap] = React.useState<any>(null);
  const [marker, setMarker] = React.useState<{
    start: any;
    end: any;
  }>();

  const onLoadMap = React.useCallback(function callback(map: google.maps.Map) {
    console.log("loading map");

    // const center = new google.maps.LatLng({
    //   lat: 15.24,
    //   lng: 100.523,
    // });

    if (map) {
      map.moveCamera({
        // center: center,
        zoom: 9,
      });
    }
    setMap(map);
  }, []);
  const centerSearch = (response: { routes: { legs: any[] }[] }) => {
    let startLocationBound = new google.maps.LatLng(
      response.routes[0].legs[0].start_location.lat(),
      response.routes[0].legs[0].start_location.lng()
    );
    let endLocationBound = new google.maps.LatLng(
      response.routes[0].legs[0].end_location.lat(),
      response.routes[0].legs[0].end_location.lng()
    );

    let startLocation = {
      lat: response.routes[0].legs[0].start_location.lat(),
      lng: response.routes[0].legs[0].start_location.lng(),
    };
    let endLocation = {
      lat: response.routes[0].legs[0].end_location.lat(),
      lng: response.routes[0].legs[0].end_location.lng(),
    };
    let center = {
      lat: (startLocation.lat + endLocation.lat) / 2,
      lng: (startLocation.lng + endLocation.lng) / 2,
    };
    var bounds = new google.maps.LatLngBounds();

    bounds.extend(startLocationBound);
    bounds.extend(endLocationBound);
    (map as google.maps.Map).fitBounds(bounds);

    // map.moveCamera({
    //   center  : center,
    //   // zoom: 9,
    // });
  };
  const [count, setCount] = React.useState<boolean>(false);
  const [state, setState] = React.useState<number>(1);
  const directionsCallback = (response: any) => {
    console.log(response);
    let newRes = { ...response };
    setCount(true);
    if (routePolyline.current.length > 0) {
      routePolyline.current.map((d) => {
        d.setMap(null);
      });
      routePolyline.current = [];
    }

    const path = newRes.routes[0].legs[0].steps.reduce(
      (sum: any, current: { path: any }) => _.concat(sum, current.path),
      []
    );

    routePolyline.current.push(
      new google.maps.Polyline({
        path: path,
        strokeColor: "#1D336D",
        strokeOpacity: 1.0,
        strokeWeight: 5,
        zIndex: 99,
      })
    );
    // listenPolyline(i);

    if (routePolyline.current.length > 0) {
      //@ts-ignore
      routePolyline.current.map((polyline, i) => {
        routePolyline.current[i].setMap(map);
      });
    }
    centerSearch(newRes);
    setMarker({
      start: newRes.routes[0].legs[0].start_location,
      end: newRes.routes[0].legs[0].end_location,
    });

    // setRes(response);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" className="text-center" gutterBottom>
        Booking Detail
      </Typography>
      <CheckScript>
        <GoogleMap
          // required
          id="direction-example"
          // required
          mapContainerStyle={{
            height: "30vh",
            width: "100%",
            marginBottom: "4px",
          }}
          // required
          zoom={10}
          // required
          center={center}
          // optional
          // onClick={() => onMapClick}
          // optional
          onLoad={(map) => {
            onLoadMap(map);
          }}
          // optional
          onUnmount={(map) => {
            // console.log("DirectionsRenderer onUnmount map: ", map);
          }}
        >
          {!count && (
            <DirectionsService
              // required
              options={{
                // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                destination: new google.maps.LatLng({
                  lat: parseFloat(data.dlatitude || "0.00"),
                  lng: parseFloat(data.dlongtitude || "0.00"),
                }),
                origin: new google.maps.LatLng({
                  lat: parseFloat(data.platitude || "0.00"),
                  lng: parseFloat(data.plongtitude || "0.00"),
                }),
           
                travelMode: google.maps.TravelMode["DRIVING"],
                provideRouteAlternatives: true,
                // drivingOptions: {
                //   departureTime: new Date(/* now, or future date */),
                //   trafficModel:  google.maps.TrafficModel.BEST_GUESS
                // },
              }}
              // required
              callback={directionsCallback}
            />
          )}
          {marker !== undefined && (
            <>
              <Marker position={marker?.start} key="start" label="1" />
              <Marker position={marker?.end} key="end" label="2" />,{/* )} */}
            </>
          )}
        </GoogleMap>
      </CheckScript>
      <div className="flex justify-between item-center mt-2">
          <Typography style={{ margin: "auto 0 " }} variant="subtitle1">
            หมายเลขคำขอ
          </Typography>
          <div className="flex flex-col ">
            <p className="  font-bold text-end ">{data.orgReqID || ""}</p>
          </div>
        </div>
      <div className="flex justify-between">
        <Typography variant="subtitle1">วันที่</Typography>
        <p className=" font-bold">{data.datetime}</p>
      </div>
     
      <div className="flex justify-between item-center mt-2">
        <Typography style={{ margin: "auto 0" }} variant="subtitle1">
          ชื่อผุ้ขอ
        </Typography>
        <div className="flex flex-col ">
          <p className=" ">
            {data.firstName} {data.lastName} ({data.tel})
          </p>
          <p className=" font-bold text-end ">{data.email}</p>
        </div>
      </div>
      <div className="flex justify-between item-center mt-2">
        <Typography style={{ margin: "auto 0" }} variant="subtitle1">
          จุดขึ้นรถ
        </Typography>
        <div className="flex flex-col ">
          <p className=" ">{data.plocation}</p>
        </div>
      </div>
      <div className="flex justify-between item-center mt-2">
        <Typography style={{ margin: "auto 0" }} variant="subtitle1">
          จุดหมายปลายทาง
        </Typography>
        <div className="flex flex-col ">
          <p className=" ">{data.dlocation}</p>
        </div>
      </div>
      <div className="flex justify-between item-center mt-2">
        <Typography style={{ margin: "auto 0 " }} variant="subtitle1">
          ระยะทาง
        </Typography>
        <div className="flex flex-col ">
          <p className="font-bold text-end">{data.minAmount?.toFixed(0)} บาท</p>
          <p className="  text-end ">
            {data.eta_distance} Km. ({data.eta_time} min.)
          </p>
        </div>
      </div>
      {data.remark !== "" && (
        <div className="flex justify-between item-center mt-2">
          <Typography style={{ margin: "auto 0 " }} variant="subtitle1">
            หมายเหตุ
          </Typography>
          <div className="flex flex-col ">
            <p className="  text-end ">{data.remark || ""}</p>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
          Back
        </Button>

        <Button variant="contained" onClick={confirmBook} sx={{ mt: 3, ml: 1 }}>
          Confirm
        </Button>
      </div>
    </React.Fragment>
  );
}
