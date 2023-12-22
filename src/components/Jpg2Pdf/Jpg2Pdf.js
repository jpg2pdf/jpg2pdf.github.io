/* eslint-disable */
import React, { useState } from "react";
import jsPDF from "jspdf";

import "./Jpg2Pdf.css";

// New class with additional fields for Image
class CustomImage extends Image {
  constructor(mimeType) {
    super();
    this.mimeType = mimeType;
  }

  // `imageType` is a required input for generating a PDF for an image.
  get imageType(){
    return this.mimeType.split("/")[1];
  }
};

// Each image is loaded and an object URL is created.
const fileToImageURL = (file) => {
  return new Promise((resolve, reject) => {
    const image = new CustomImage(file.type);

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Failed to convert File to Image"));
    };

    image.src = URL.createObjectURL(file);
  });
};

// The dimensions are in millimeters.
const A4_PAPER_DIMENSIONS = {
  width: 210,
  height: 297,
};

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

// Calculates the best possible position of an image on the A4 paper format,
// so that the maximal area of A4 is used and the image ratio is preserved.
const imageDimensionsOnA4 = (dimensions) => {
  const isLandscapeImage = dimensions.width >= dimensions.height;

  // If the image is in landscape, the full width of A4 is used.
  if (isLandscapeImage) {
    return {
      width: A4_PAPER_DIMENSIONS.width,
      height:
        A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
    };
  }

  // If the image is in portrait and the full height of A4 would skew
  // the image ratio, we scale the image dimensions.
  const imageRatio = dimensions.width / dimensions.height;
  if (imageRatio > A4_PAPER_RATIO) {
    const imageScaleFactor =
      (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

    const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;

    return {
      height: scaledImageHeight,
      width: scaledImageHeight * imageRatio,
    };
  }

  // The full height of A4 can be used without skewing the image ratio.
  return {
    width: A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
    height: A4_PAPER_DIMENSIONS.height,
  };
};

// Creates a PDF document containing all the uploaded images.
const generatePdfFromImages = (images) => {
  // Default export is A4 paper, portrait, using millimeters for units.
  const doc = new jsPDF();

  // We let the images add all pages,
  // therefore the first default page can be removed.
  doc.deletePage(1);

  images.forEach((image) => {
    const imageDimensions = imageDimensionsOnA4({
      width: image.width,
      height: image.height,
    });

    doc.addPage();
    doc.addImage(
      image.src,
      image.imageType,
      // Images are vertically and horizontally centered on the page.
      (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
      (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
      imageDimensions.width,
      imageDimensions.height
    );
  });

  // Creates a PDF and opens it in a new browser tab.
  const pdfURL = doc.output("bloburl");
  window.open(pdfURL, "_blank");
};

function Jpg2Pdf() {
  // State for uploaded images
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageUpload = (event) => {
      // `event.target.files` is of type `FileList`,
      // we convert it to Array for easier manipulation.
      const fileList = event.target.files;
      const fileArray = fileList ? Array.from(fileList) : [];

      // Uploaded images are read and the app state is updated.
      const fileToImagePromises = fileArray.map(fileToImageURL);
      Promise.all(fileToImagePromises).then((images) => {
        const combinedImages = uploadedImages.concat(images);
        setUploadedImages(combinedImages);
      });
  };

  const cleanUpUploadedImages = () => {
    setUploadedImages([]);
    uploadedImages.forEach((image) => {
      // The URL.revokeObjectURL() releases an existing object URL
      // which was previously created by URL.createObjectURL().
      // It lets the browser know not to keep the reference to the file any longer.
      URL.revokeObjectURL(image.src);
    });
  };

  const handleGeneratePdfFromImages = () => {
    generatePdfFromImages(uploadedImages);
    cleanUpUploadedImages();
  };

  return (
    <>
      <h1 className="h1main">JPG to PDF Free Converter</h1>
      {/* Overview of uploaded images */}
      <div className="images-container">
        {uploadedImages.length > 0 ? (
          uploadedImages.map((image) => (
            <img alt="Uploaded Images" key={image.src} src={image.src} className="uploaded-image" />
          ))
        ) : (
          <p>Upload some images...</p>
        )}
      </div>

      {/* Buttons for uploading images and generating a PDF */}
      <div className="buttons-container">
        {/* Clears images */}
        <button
          onClick={cleanUpUploadedImages}
          className="button"
          disabled={uploadedImages.length === 0}
        >
          Clear
        </button>

        {/* Uploads images */}
        <label htmlFor="file-input">
          <span className="button">Add</span>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            // Native file input is hidden only for styling purposes
            style={{ display: "none" }}
            multiple
          />
        </label>

        {/* Generates PDF */}
        <button
          onClick={handleGeneratePdfFromImages}
          className="button"
          disabled={uploadedImages.length === 0}
        >
          Generate
        </button>
      </div>
      <br/>
      <div>
        <p>Meet our easy-to-use JPG to PDF Conversion Tool Jpg2Pdf your solution for turning JPEG images into PDFs effortlessly. Our online tool is simple and quick, making the conversion process a breeze. Enjoy a smooth experience with a user-friendly interface. Upgrade your document management with our tool designed for speed and accuracy. Convert confidently and showcase your documents in a whole new way.</p>
      </div>
      <br/>
      <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-show-count="false" target="_blank">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </>
  );
}

export default Jpg2Pdf;