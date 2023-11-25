import { useState } from "react";
import "./index.css";

//sensitive info such as the key is stored ina .env file to avoid being read in the main code
const ApiKey = import.meta.env.VITE_APIKEY;

export default function App() {
  //here, we leave data empty because we haven't retrieved it yet, but we will define the html <input value={image} />
  const [data, setData] = useState();
  const [caption, setCaption] = useState();
  const [image, setImage] = useState();

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
        `https://thevenardmission2.cognitiveservices.azure.com/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=tags,caption`,
        fetchOptions
      );
      //we need to parse the data with the .json() so we can do something with it
      const parsedData = await response.json();
      //setData so we can now call the parsedData as a variable called 'data' as defined in setData useState
      setData(parsedData);
      console.log(parsedData);
      setCaption("This is " + parsedData.captionResult.text);
    } catch (error) {
      console.error("There is an error during fetch:", error);
    }
  };

  return (
    <div class=" font-mono flex flex-col bg-gradient-to-r from-cyan-500 to-blue-500 h-screen">
      <div class="flex justify-center ">
        <div class="flex flex-col">
          <h1 class="p-10 flex justify-center text-2xl">Turners Cars</h1>
          <p1 class="pb-10 justify-center">
            Enter an image URL of your car below and we will provide a
            description:
          </p1>
          <div class="flex justify-center">
            <input
              class="pb-1 w-1/5 flex justify-center"
              placeholder="image URL"
              onChange={handleOnChange}
              value={image}
            />
          </div>
          <div class="flex justify-center p-10">
            {/* shows the image when input into the search bar */}
            <img src={image} class="w-1/3 rounded "></img>{" "}
          </div>
          <button class="pb-10" onClick={onButtonClick}>
            Search
          </button>
          {/* displays the captionResult */}
          <h1 class="flex justify-center"> {caption}</h1>
        </div>
      </div>
    </div>
  );
}
