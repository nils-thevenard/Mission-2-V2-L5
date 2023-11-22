import "./App.css";
import { useState } from "react";

const ApiKey = "e093b27ea1e64423807fbb02d1e50f59";
const AzureEndpoint = "https://thevenardmission2.cognitiveservices.azure.com/";

// const ApiKey = import.meta.env.REACT_APP_APIKEY;
// const AzureEndpoint = import.meta.env.REACT_APP_ENDPOINT_URL;

export default function App() {
  //in React we use "hooks" like setState to define the state of changing variables.
  //We can leave the variable empty or we can define it an initial value
  //here, we leave data empty because we haven't retrieved it yet, but we will define the html <input value={image} />
  const [data, setData] = useState();
  const [image, setImage] = useState(
    "https://www.toyota.co.nz/globalassets/new-vehicles/camry/2021/camry-zr-axhzr-nm1-axrzr-nm1/clear-cuts/updated-clear-cuts/camry-zr-eclipse.png"
  );

  //When the user enters something into the input field, we will monitor this and update the "image" variable using setImage
  const handleOnChange = (e) => {
    setImage(e.target.value);
  };

  //when the user clicks the button, we will initiate our call to the API
  //once the data has been fetched, it will setData with the data useState
  const onButtonClick = async (e) => {
    //preventDefault stops the button from acting like a default button (e.g. submitting a form) as we are using it asynchronously
    e.preventDefault();
    console.log("Click registered and ready to fetch!");
    try {
      //Now we will use a const to define the parameters for accessing the API including the APIKey and image url we stored using setImage
      const fetchOptions = {
        method: "POST",
        timeout: 50000,
        headers: {
          "Ocp-Apim-Subscription-Key": ApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: image,
        }),
      };
      //here we will use fetch to send all our data to the API and store it as "response"
      //We are combining our AzureEndpoint url to make it longer, notice at the end of the url, we define "tags,caption"
      //this url outlines what data we are requesting to be sent back, you can add more such as "denseCaptions"
      //check the Azure Analyze API documentation for the options
      const response = await fetch(
        `${AzureEndpoint}computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=tags,caption,denseCaptions,objects`,
        fetchOptions
      );
      //we need to parse the data with the .json() so we can do something with it
      const parsedData = await response.json();
      //setData so we can now call the parsedData as a variable called 'data' as defined in setData useState
      setData(parsedData);
      //by checking the console we can see the raw json data and structure and confirm we got a response
      //this is also good to reference and make it easier when writing the html to display it,
      //but we should remove it and ideally use better tools to view it after confirming operation as we could forget to remove it
      console.log(parsedData);
    } catch (error) {
      console.error("There is an error during fetch:", error);
    }
  };
  // console.log(data.captionResult.text);

  return (
    <div className="App">
      <h1>How to call from Azure API example</h1>
      <div className="inputs">
        <input
          className="Input"
          placeholder="Enter image URL"
          onChange={handleOnChange}
          value={image}
        />
        <button className="Button" onClick={onButtonClick}>
          Run Service
        </button>
        <h1>{data.captionResult.text}</h1>
      </div>
    </div>
  );
}
