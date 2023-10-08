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
		<div className="mt-[calc(100vh/12*0.8)]">
			<Globe
				data={data}
				globeImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
				hexPolygonsData={countries.features}
				hexPolygonResolution={3}
				hexPolygonMargin={0.2}
				ref={globeEl}
				// hexPolygonColor={()=>"#ffffff"}
				animateIn={false}
				hexPolygonColor={(el) => { console.log(el); return `#eeff12`;}}
				// hexPolygonLabel={({ properties: d }) => `
				//   <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
				//   Population: <i>${d.POP_EST}</i>
				// `}
			/>
		</div>
  );
};

export default MyGlobe