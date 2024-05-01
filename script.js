let imgElement = document.getElementById("imageSrc");
let inputElement = document.getElementById("fileInput");
inputElement.addEventListener(
  "change",
  (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  },
  false
);

var mat = null;
var mat_resize = null;
var moduleLoaded = false;

function resizeImage() {
  var cols_ori = mat.cols;
  var rows_ori = mat.rows;
  var x = parseInt(document.getElementById("reqColumns").value);
  var y = (x * rows_ori) / cols_ori;
  let dsize = new cv.Size(x, y);
  cv.resize(mat, mat_resize, dsize, 0, 0, cv.INTER_LINEAR);
  cv.imshow("canvasOutput", mat_resize);
  updateASCIIart();
}

imgElement.onload = function () {
  mat = cv.imread(imgElement);
  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
  resizeImage();
};

function copyToClipboard() {
  const code = document.getElementById("outputDemo");
  navigator.clipboard.writeText(code.innerHTML);
}

function updateASCIIart() {
  var th_value = parseInt(document.getElementById("th_value").value);
  let dst = new cv.Mat();
  cv.threshold(mat_resize, dst, Number(th_value), 255, cv.THRESH_BINARY);
  cv.imshow("canvasOutput", dst);

  const lightSpaceChar = document.getElementById("lightSpaceChar").value;
  const darkSpaceChar = document.getElementById("darkSpaceChar").value;
  const delimiterChar = document.getElementById("delimiterChar").value;

  var cols = dst.cols;
  var rows = dst.rows;
  console.log(cols);
  console.log(rows);
  var imageDataArr = [];
  for (var i = 0; i < rows; i++) {
    var data = [];
    for (var j = 0; j < cols; j++) {
      if (isNaN(dst.ucharAt(i, j))) {
        // data.push(0);
        data.push("");
      } else {
        // data.push(dst.ucharAt(i, j));
        if (dst.ucharAt(i, j) == 255) {
          data.push(lightSpaceChar);
        } else {
          data.push(darkSpaceChar);
        }
      }
    }
    imageDataArr.push(data);
  }
  imageASCII = imageDataArr.map((row) => row.join(delimiterChar)).join("\n");
  // console.log(imageASCII);
  document.getElementById("outputDemo").innerHTML = imageASCII;
}

var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    document.getElementById("body").style.display = "block";
    imgElement.src = "img_girl.jpg";
    mat = new cv.Mat();
    mat_resize = new cv.Mat();
  },
};
