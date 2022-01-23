const fs = require("fs");
const Jimp = require("jimp");
const imagemin = require("imagemin");
const webp = require("imagemin-webp");
const pngquant = require("imagemin-pngquant");

(async () => {
  fs.mkdirSync("./temp/img", { recursive: true });
  fs.mkdirSync("./public/img", { recursive: true });

  const images = [
    {
      filename: "header",
      ext: "png",
      width: 3840,
      height: 1056,
      resizeWidths: [1776, 888],
    },
    {
      filename: "footer",
      ext: "png",
      width: 3840,
      height: 1152,
      resizeWidths: [1776, 888],
    },
  ];

  for (const { filename, ext, width, height, resizeWidths } of images) {
    for (const resizeWidth of resizeWidths) {
      const image = await Jimp.read(`./resources/img/${filename}.${ext}`);
      await image
        .resize(resizeWidth, Math.floor((height / width) * resizeWidth))
        .write(`./temp/img/${filename}-${resizeWidth}.${ext}`);
    }
  }

  console.log(
    await imagemin(["./temp/img/*"], {
      destination: "./public/img",
      plugins: [
        webp({
          quality: 85,
        }),
      ],
    })
  );

  console.log(
    await imagemin(["./temp/img/*"], {
      destination: "./public/img",
      plugins: [pngquant()],
    })
  );
})();
