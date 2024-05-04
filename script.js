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
var imageASCII = "Try again to copy :)";
var advancedOptionsEnable = false;

function resizeImage() {
  var cols_ori = mat.cols;
  var rows_ori = mat.rows;
  var x = parseInt(document.getElementById("reqColumns").value);
  if (x < 5) {
    x = 5;
    document.getElementById("reqColumns").value = 5;
  }
  var y = parseInt((x * rows_ori) / cols_ori);
  let dsize = new cv.Size(x, y);
  cv.resize(mat, mat_resize, dsize, 0, 0, cv.INTER_LINEAR);
  cv.imshow("canvasOutput", mat_resize);
  document.getElementById(
    "outputSizeInfo"
  ).innerHTML = `The output text will have ${y} rows and ${x} columns.`;
  updateASCIIart();
}

imgElement.onload = function () {
  mat = cv.imread(imgElement);
  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
  resizeImage();
};

function copyToClipboard() {
  // const code = document.getElementById("outputDemo");
  navigator.clipboard.writeText(imageASCII);
}

function resizeOutputScale() {
  var resizeOutputScaleVal = parseInt(document.getElementById("resizeOutputScaleVal").value) / 100;
  // console.log(resizeOutputScaleVal);
  document.getElementById("outputDemo").style.transform = "scale(" + resizeOutputScaleVal + ")";
}

function advancedOptions() {
  advancedOptionsEnable = !advancedOptionsEnable;
  if (advancedOptionsEnable) {
    document.getElementById("divAdvFeatures").style.display = "block";
    document.getElementById("divNormFeatures").style.display = "none";
  } else {
    document.getElementById("divAdvFeatures").style.display = "none";
    document.getElementById("divNormFeatures").style.display = "block";
  }
}

function updateASCIIart() {
  let dst = new cv.Mat();
  if (advancedOptionsEnable) {
    var thType = parseInt(document.getElementById("thType").value);
    var blockSize = parseInt(document.getElementById("blockSize").value);
    var constant_c = parseInt(document.getElementById("constant_c").value);

    cv.adaptiveThreshold(mat_resize, dst, 255, thType, cv.THRESH_BINARY, blockSize, constant_c);
  } else {
    var th_value = parseInt(document.getElementById("th_value").value);
    cv.threshold(mat_resize, dst, Number(th_value), 255, cv.THRESH_BINARY);
  }
  cv.imshow("canvasOutput", dst);

  const lightSpaceChar = document.getElementById("lightSpaceChar").value;
  const darkSpaceChar = document.getElementById("darkSpaceChar").value;
  const delimiterChar = document.getElementById("delimiterChar").value;

  var cols = dst.cols;
  var rows = dst.rows;
  // console.log(cols);
  // console.log(rows);
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
  document.getElementById("outputDemo").innerHTML = imageASCII;

  if (document.getElementById("showOnConsole").checked) {
    console.log(imageASCII);
  }
}

function downloadImage() {
  var d = new Date();
  var filename = `image_${d.getHours()}_${d.getMinutes()}.png`;
  const anchor = document.createElement("a");

  html2canvas(document.getElementById("outputDiv"), { scale: 1 }).then((canvas) => {
    const data = canvas.toDataURL("image/png;base64");
    anchor.href = data;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  });
}

var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    document.getElementById("body").style.display = "block";
    imgElement.src = "extras/sample.png";
    mat = new cv.Mat();
    mat_resize = new cv.Mat();
  },
};
