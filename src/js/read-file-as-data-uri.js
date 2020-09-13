export function readFileAsDataUri(file_obj) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (evt) => {
            return resolve(evt.target.result);
        };
        reader.onerror = () => {
            return reject(new Error('Failed to read image file:', file_obj.name));
        };
        reader.readAsDataURL(file_obj);
    })
}



// WEBPACK FOOTER //
// ./src/images_processor/read-file-as-data-uri.js