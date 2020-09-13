import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createCanvas } from "./js/create-canvas";
import { loadImage } from "./js/load-img";
import { readFileAsDataUri } from "./js/read-file-as-data-uri";
// import Compressor from "compressorjs";

const layout = require("layout");
let padding_pixels = 0;
let sprite_image_uri = "";
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();

var files_list = [];
var itemsCSSInfo = [];
var dropZone = document.getElementById("dropZone");
// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener("dragover", function (e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
});

// Get file data on drop
dropZone.addEventListener("drop", function (e) {
  e.stopPropagation();
  e.preventDefault();
  var files = e.dataTransfer.files; // Array of all files
  
  handle_new_file(files);
  document.getElementById("drop-box-text").innerText = "Files Uploaded";
});

function handle_new_file(files) {
  let awaiting = [];
  for (let i = 0; i < files.length; i++) {
    let f = files[i];
    if ((!f.type.match("image.*"), f.type.match("image/tiff.*"))) {
      continue;
    }
    // console.log(f);
    ((file) => {
      awaiting.push(
        readFileAsDataUri(file)
          .then(loadImage)
          .then((img) => {
            // console.log(img); //Reading Image Data
            let target_rect = { width: 100, height: 200 };
            let small_size = {};
            let ratio = img.width / img.height;
            if (ratio > target_rect.width / target_rect.height) {
              // Width is dominating
              small_size.width = Math.min(img.width, target_rect.width); // Small images shouldn't stretch
              small_size.height = (small_size.width * img.height) / img.width;
            } else {
              small_size.height = Math.min(img.height, target_rect.height); // Small images shouldn't stretch
              small_size.width = (small_size.height * img.width) / img.height;
            }
            let small_image_canvas = createCanvas(
              small_size.width,
              small_size.height
            );
            let ctx = small_image_canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, small_size.width, small_size.height);
            let small_img_uri = small_image_canvas.toDataURL();
            let new_file = {
              filename: file.name,
              width: img.width,
              height: img.height,
              img: img,
              small_width: small_size.width,
              small_height: small_size.height,
              small_img_uri: small_img_uri,
              sprite_info: { x: 0, y: 0 },
            };
            console.log(new_file);
            
            files_list.push(new_file);
          })
          .catch((e) => {
            console.error("Failed to load image: " + file.name);
          })
      );
      // console.log(awaiting);
      
    })(f);
  }
  Promise.all(awaiting).then(() => {
    generate_css_sprite();
    document.getElementById("drop-box-text").innerText =
      "Process Completed\nFiles Avaliable for Downlaod";
  });
}

function generate_css_sprite() {
  let layer = layout("binary-tree"); /**Binary Tree Algorithm for sorting */
  files_list.forEach((file) => {
    layer.addItem({
      width: file.width + 2 * parseInt(padding_pixels),
      height: file.height + 2 * parseInt(padding_pixels),
      file: file,
    });
  });

  let info = layer.export();
  let sprite_image_canvas = createCanvas(info.width, info.height);
  let ctx = sprite_image_canvas.getContext("2d");
  info.items.forEach((item) => {
    ctx.drawImage(
      item.file.img,
      item.x + parseInt(padding_pixels),
      item.y + parseInt(padding_pixels),
      item.file.width,
      item.file.height
    );
    item.file.sprite_info.x = item.x + parseInt(padding_pixels);
    item.file.sprite_info.y = item.y + parseInt(padding_pixels);
    console.log(item.file.filename, item.file.filename.split("."));
    let t_name_arr = item.file.filename.split(".");
    t_name_arr.pop();
    item.file.sprite_info.class_name = t_name_arr
      .join(".")
      .replace(/[\.\s\-\(\)\[\]\{\}]/g, "_");
  });

  sprite_image_uri = sprite_image_canvas.toDataURL("image/jpeg");
  // sprite_image_uri = sprite_image_canvas.toDataURL();
  // imageBlobObject(sprite_image_uri);
  generateData(info.items);
  downloadImageFile(sprite_image_uri);
}

// Download Generated Image File
function downloadImageFile(imgUri) {
  // var a = document.createElement("a"); //Create <a>
  const imgDataBtn = document.getElementById("img-btn");
  imgDataBtn.href = sprite_image_uri; //Image Base64 Goes here
  imgDataBtn.download = "SpriteImage"; //File name Here
}

// Generate CSS Data
function generateData(info) {
  info.forEach((element) => {
    var x = element.file.filename;
    var remove_after = x.indexOf(".");
    var result = x.substring(0, remove_after);
    var itemStylingObject = {
      file_name: "",
      width: "",
      height: "",
      background: "",
      positionX: "",
      positionY: ""
    };
    itemStylingObject.file_name = result;
    itemStylingObject.width = element.width;
    itemStylingObject.height = element.height;
    itemStylingObject.background = `url('SpriteImage.jpg') ${element.x}px ${element.y}px;`;
    itemStylingObject.positionX = element.x;
    itemStylingObject.positionY = element.y;
    itemsCSSInfo.push(itemStylingObject);
  });
  
  // Start Data File Download
  // downloadDataFile("spriteCSSData.json", JSON.stringify(itemsCSSInfo));
  downloadDataFile("spriteCSSData.json", JSON.stringify(itemsCSSInfo, null, 2));
}

function downloadDataFile(filename, text) {
  const dataBtn = document.getElementById("data-btn");
  // var a = document.createElement(<Button/>); //Create <a>
  dataBtn.setAttribute(
    "href",
    "data:text/json;charset=utf-8," + encodeURIComponent(text)
  );
  dataBtn.download = "Download" + filename; //File name Here
  // dataBtn.innerHTML = "Download Data File";
  document.getElementById("button-container").style.display = "flex";
}

// Create a Blob Object for Image Compression
// function imageBlobObject(sprite_image_uri) {
// const byteCharacters = atob(sprite_image_uri.split(',')[1]);

// const byteNumbers = new Array(byteCharacters.length);
// for (let i = 0; i < byteCharacters.length; i++) {
//     byteNumbers[i] = byteCharacters.charCodeAt(i);
// }

// const byteArray = new Uint8Array(byteNumbers);
// const blob = new Blob([byteArray], {type: 'image/png'});

// new Compressor(blob, {
//   quality: 0.8,
//   success(result) {
//     console.log(result);
//     console.log(blob)
    
//     // const formData = new FormData();

//     // The third parameter is required for server
//     // formData.append('file', result, result.name);

//     // // Send the compressed image file to server with XMLHttpRequest.
//     // axios.post('/path/to/upload', formData).then(() => {
//     //   console.log('Upload success');
//     // });
//   },
//   error(err) {
//     console.log(err.message);
//   },
// });

// }