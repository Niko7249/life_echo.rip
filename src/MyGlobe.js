import { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";


// import countriesJson from "../public/countries.geojson"

const MyGlobe = () => {
  const [data, setData] = useState([]);
	const globeEl = useRef();

	const [countries, setCountries] = useState({ features: []});

    useEffect(() => {
			const globe = globeEl.current;

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
			
      fetch('/countries.geojson').then(res => res.json()).then(setCountries);
			function updateSize(event) {
				window.addEventListener("resize", () => {
					globe.renderer().setSize(window.innerWidth, window.innerHeight);
					globe.camera().aspect = window.innerWidth / window.innerHeight;
					globe.camera().updateProjectionMatrix();
				});
			}
	
			window.addEventListener("resize", updateSize);
	
			return () => {
				window.removeEventListener("resize", updateSize);
			};
    }, []);
  // Fetch data from an API or other source

  return (
			<Globe
				data={data}
				globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
				hexPolygonsData={countries.features}
				hexPolygonResolution={3}
				hexPolygonMargin={0.2}
				ref={globeEl}
				hexPolygonColor={()=>"#ffffff"}
				animateIn={false}
				// hexPolygonColor={() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`}
				// hexPolygonLabel={({ properties: d }) => `
				//   <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
				//   Population: <i>${d.POP_EST}</i>
				// `}
			/>
  );
};

export default MyGlobe