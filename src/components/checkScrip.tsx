import { LoadScript, useJsApiLoader } from "@react-google-maps/api";

import React from "react";

export default function CheckScript({ children }: any) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDEgQ3gfGVRqfFHLrZJaadYiuWXVNC63Sk",
    region : "TH",
    language : 'th',
    libraries : ["places"]
  })
  if (isLoaded) {
    return  (
   
        <>{children}</>
    );
  }
  return <> </>;
}
