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
      response.routes[selectRouteState].legs[0].start_location.lat(),
      response.routes[selectRouteState].legs[0].start_location.lng()
    );
    let endLocationBound = new google.maps.LatLng(
      response.routes[selectRouteState].legs[0].end_location.lat(),
      response.routes[selectRouteState].legs[0].end_location.lng()
    );

    let startLocation = {
      lat: response.routes[selectRouteState].legs[0].start_location.lat(),
      lng: response.routes[selectRouteState].legs[0].start_location.lng(),
    };
    let endLocation = {
      lat: response.routes[selectRouteState].legs[0].end_location.lat(),
      lng: response.routes[selectRouteState].legs[0].end_location.lng(),
    };
    let center = {
      lat: (startLocation.lat + endLocation.lat) / 2,
      lng: (startLocation.lng + endLocation.lng) / 2,
    };
    var bounds = new google.maps.LatLngBounds();

    bounds.extend(startLocationBound);
    bounds.extend(endLocationBound);

    (map as google.maps.Map).fitBounds(bounds);
    (map as google.maps.Map).setZoom(10);

    // map.moveCamera({
    //   // center  : center,
    //   zoom: 10,
    // });
  };

  const [count, setCount] = React.useState<boolean>(false);
  const [res, setRes] = React.useState<any>({
    request: null,
    routes: null,
    status: "",
    geocoded_waypoints: "",
  });

  let countPai = React.useRef(0);
  const selectRoute = React.useRef(0);
  const [selectRouteState, setSelectRouteState] = React.useState(0);
  const [state, setState] = React.useState<any>({
    response: null,
    travelMode: "DRIVING",
    origin,
    destination: "",
  });

 



  const listenPolyline = (i: number) => {
    google.maps.event.addListener(
      routePolyline.current[i],
      "click",
      function (h: any) {
        let index = i;
        selectRoute.current = i;
        let newDistance = res.routes[i].legs[0].distance.value / 1000;
        let newTime = res.routes[i].legs[0].duration.value / 60;
        let distancePrice = parseInt(
          data?.priceConfig?.price_per_distance ?? "0"
        );
        let durationPrice = parseInt(
          data?.priceConfig?.price_per_time ?? "0"
        );
        let etaTimePrice = parseInt((newTime * durationPrice).toFixed(0));
        let etadistancePrice = parseInt(((newDistance - 2) * distancePrice).toFixed(0));
        setData((prev: any) => {
          return {
            ...prev,
            eta_distance: parseInt(newDistance.toFixed(2)),
            eta_distance_price: etadistancePrice,
            eta_time: parseInt(newTime.toFixed(2)),
            eta_time_price: etaTimePrice,
            minAmount:
              Number(parseInt(data.priceConfig.base_price)) + Number(parseInt(data.priceConfig.minimum_price))+
              Number(etaTimePrice) +
              Number(etadistancePrice),
          };
        });
        routePolyline.current.map((d) => {
          d.setMap(null);
        });
        let clonePolyline = routePolyline.current;

        clonePolyline.map((polyline, newIndex) => {
          if (newIndex === index) {
            // @ts-ignore
            clonePolyline[newIndex] = new google.maps.Polyline({
              path: clonePolyline[newIndex].getPath(),
              strokeColor: "#1D336D",
              strokeOpacity: 1.0,
              strokeWeight: 5,
              zIndex: 99,
            });
          } else {
            // @ts-ignore

            clonePolyline[newIndex] = new google.maps.Polyline({
              path: clonePolyline[newIndex].getPath(),
              strokeColor: "#808080",
              strokeOpacity: 1,
              strokeWeight: 5,
              zIndex: 1,
            });
          }
          listenPolyline(newIndex);
        });

        clonePolyline.map((polyline, indexInt) => {
          clonePolyline[indexInt].setMap(map);
        });
        setSelectRouteState(index);
        centerSearch(res);
      }
    );
  };

  React.useEffect(() => {
    if (res.routes !== null) {
      if (routePolyline.current.length > 0) {
        routePolyline.current.map((d) => {
          d.setMap(null);
        });
        routePolyline.current = [];
      }


      if(res.routes !== null){
      
      }
      let newDistance = res.routes[0].legs[0].distance.value / 1000;
      let newTime = res.routes[0].legs[0].duration.value / 60;
      let distancePrice = parseInt(
        data?.priceConfig?.price_per_distance ?? "0"
      );
      let durationPrice = parseInt(
        data?.priceConfig?.price_per_time ?? "0"
      );
      let etaTimePrice = parseInt((newTime * durationPrice).toFixed(0));
      let etadistancePrice = parseInt(((newDistance - 2) * distancePrice).toFixed(0));
      setData((prev: any) => {
        return {
          ...prev,
          eta_distance: parseInt(newDistance.toFixed(2)),
          eta_distance_price: etadistancePrice,
          eta_time: parseInt(newTime.toFixed(2)),
          eta_time_price: etaTimePrice,
          minAmount:
            Number(parseInt(data.priceConfig.base_price)) + Number(parseInt(data.priceConfig.minimum_price))+
            Number(etaTimePrice) +
            Number(etadistancePrice),
        };
      });


      res.routes.map((route: any, i: number) => {
        const path = route.legs[0].steps.reduce(
          (sum: any, current: { path: any }) => _.concat(sum, current.path),
          []
        );
        // console.log(res.routes);
        routePolyline.current.push(
          new google.maps.Polyline({
            path: path,
            strokeColor: selectRoute.current === i ? "#1D336D" : "#808080",
            strokeOpacity: selectRoute.current === i ? 1.0 : 0.6,
            strokeWeight: 5,
            zIndex: selectRoute.current === i ? 99 : 1,
          })
        );
        listenPolyline(i);
      });
      if (routePolyline.current.length > 0) {
        //@ts-ignore
        routePolyline.current.map((polyline, i) => {
          routePolyline.current[i].setMap(map);
        });
      }
    }
  }, [res]);

  // const directionsCallback = (response: any) => {
  //   setCount(true);
  //   if (response !== null && countPai.current < 1) {
  //     if (response.status === "OK") {
  //       let origin = response.request.origin.query;
  //       let dest = response.request.destination.query;
  //       let startLocation = {
  //         lat: response.routes[0].legs[0].start_location.lat(),
  //         lng: response.routes[0].legs[0].start_location.lng(),
  //       };
  //       let endLocation = {
  //         lat: response.routes[0].legs[0].end_location.lat(),
  //         lng: response.routes[0].legs[0].end_location.lng(),
  //       };

  //       countPai.current += 1;

  //       centerSearch(response);
  //       console.log(response);

  //       setState((prev : any) =>  { ...state, response });
  //     }
  //   } else {
  //     countPai.current = 0;
  //   }
  // };

  const directionsCallback = (response: any) => {
    let newRes = { ...response };
    setCount(true);
    if (routePolyline.current.length > 0) {
      routePolyline.current.map((d) => {
        d.setMap(null);
      });
      routePolyline.current = [];
    }

    if (routePolyline.current.length > 0) {
      routePolyline.current.map((d) => {
        d.setMap(null);
      });
      routePolyline.current = [];
    }

    // const path = newRes.routes[0].legs[0].steps.reduce(
    //   (sum: any, current: { path: any }) => _.concat(sum, current.path),
    //   []
    // );

    // routePolyline.current.push(
    //   new google.maps.Polyline({
    //     path: path,
    //     strokeColor: "#1D336D",
    //     strokeOpacity: 1.0,
    //     strokeWeight: 5,
    //     zIndex: 99,
    //   })
    // );
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

    setRes(response);
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
          zoom={9}
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
          เส้นทาง
        </Typography>
        <div className="flex flex-col ">
          <p className="  text-end ">
            {res.routes !== null && res.routes[selectRouteState].summary}
          </p>
        </div>
      </div>
      <div className="flex justify-between item-center mt-2">
        <Typography style={{ margin: "auto 0 " }} variant="subtitle1">
          ระยะทาง
        </Typography>
        <div className="flex flex-col ">
          <p className="font-bold text-end">{data?.minAmount?.toFixed(0)} บาท</p>
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
