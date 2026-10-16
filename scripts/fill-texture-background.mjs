// โมเดลจาก AI image-to-3D มักใช้ภาพสินค้าที่มีพื้นหลังขาวเป็น texture
// พื้นขาวนั้นจะโผล่เป็นเส้นตามตะเข็บข้าง สคริปต์นี้เติมสีผ้าที่อยู่ใกล้ที่สุดทับพื้นหลังที่ต่อกับขอบภาพ
// ใช้: node scripts/fill-texture-background.mjs <in.glb> <out.glb> [imageIndex=0]
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { readdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const pnpmDir = join(dirname(new URL(import.meta.url).pathname), "../node_modules/.pnpm");
const sharpDir = readdirSync(pnpmDir).find((name) => name.startsWith("sharp@"));
const sharp = require(join(pnpmDir, sharpDir, "node_modules/sharp"));

const [input, output, imageArg = "0"] = process.argv.slice(2);
const glb = readFileSync(input);
const jsonLength = glb.readUInt32LE(12);
const json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString());
const binHeader = 20 + jsonLength;
const binLength = glb.readUInt32LE(binHeader);
let bin = glb.subarray(binHeader + 8, binHeader + 8 + binLength);

const image = json.images[Number(imageArg)];
const view = json.bufferViews[image.bufferView];
const source = bin.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength);

const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const isBackground = (i) => {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
  return Math.min(r, g, b) > 115 && Math.max(r, g, b) - Math.min(r, g, b) < 30;
};

// 1) หาพื้นหลังด้วย flood fill จากขอบภาพ (ลูกไม้ขาวที่อยู่ในผ้าจึงไม่ถูกแตะ)
const background = new Uint8Array(width * height);
const queue = [];
for (let x = 0; x < width; x++) queue.push(x, (height - 1) * width + x);
for (let y = 0; y < height; y++) queue.push(y * width, y * width + width - 1);
for (let head = 0; head < queue.length; head++) {
  const i = queue[head];
  if (background[i] || !isBackground(i)) continue;
  background[i] = 1;
  const x = i % width;
  if (x > 0) queue.push(i - 1);
  if (x < width - 1) queue.push(i + 1);
  if (i >= width) queue.push(i - width);
  if (i < width * (height - 1)) queue.push(i + width);
}

// ช่องระหว่างขาที่ปลายขาชนกันจะถูกล้อมไว้ flood fill จากขอบเข้าไม่ถึง
// นับเป็นพื้นหลังด้วยถ้าเป็นแถบสว่างที่สูงกว่ากว้างมาก (ลูกไม้ที่กระเป๋าเป็นแถบกว้าง จึงไม่โดน)
const seen = new Uint8Array(width * height);
for (let start = 0; start < width * height; start++) {
  if (seen[start] || background[start] || !isBackground(start)) continue;
  const region = [start];
  seen[start] = 1;
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let head = 0; head < region.length; head++) {
    const i = region[head];
    const x = i % width, y = (i - x) / width;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    for (const n of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width]) {
      if (n < 0 || n >= width * height || seen[n] || background[n] || !isBackground(n)) continue;
      seen[n] = 1;
      region.push(n);
    }
  }
  if (maxY - minY > 3 * (maxX - minX + 1) && maxY - minY > height * 0.1) for (const i of region) background[i] = 1;
}

// ขอบภาพสินค้ามักเป็นสีเทาอ่อนจาง (anti-aliasing / เงา) กินขอบผ้าเข้าไปอีกนิดไม่ให้สีเทานั้นถูกลากออกไป
for (let pass = 0; pass < 4; pass++) {
  const grow = [];
  for (let i = 0; i < width * height; i++) {
    if (background[i]) continue;
    const x = i % width;
    if ((x > 0 && background[i - 1]) || (x < width - 1 && background[i + 1]) || background[i - width] || background[i + width]) grow.push(i);
  }
  for (const i of grow) background[i] = 1;
}

// 2) เติมพื้นหลังด้วยสีผ้าที่อยู่ใกล้ที่สุด (BFS ขยายออกจากขอบผ้า)
const frontier = [];
for (let i = 0; i < width * height; i++) if (!background[i]) frontier.push(i);
for (let head = 0; head < frontier.length; head++) {
  const i = frontier[head];
  const x = i % width;
  for (const n of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width]) {
    if (n < 0 || n >= width * height || !background[n]) continue;
    background[n] = 0;
    data.copy(data, n * 4, i * 4, i * 4 + 4);
    frontier.push(n);
  }
}

const png = await sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();

// 3) ต่อภาพใหม่ท้าย BIN แล้วชี้ image ไปที่ bufferView ใหม่ (ข้อมูลเก่าจะถูกทิ้งตอน optimize)
const pad = (buffer, fill) => Buffer.concat([buffer, Buffer.alloc((4 - (buffer.length % 4)) % 4, fill)]);
bin = pad(bin, 0);
json.bufferViews.push({ buffer: 0, byteOffset: bin.length, byteLength: png.length });
image.bufferView = json.bufferViews.length - 1;
bin = pad(Buffer.concat([bin, png]), 0);
json.buffers[0].byteLength = bin.length;

const jsonChunk = pad(Buffer.from(JSON.stringify(json)), 0x20);
const header = Buffer.alloc(12);
header.write("glTF", 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + bin.length, 8);
const chunk = (body, type) => {
  const head = Buffer.alloc(8);
  head.writeUInt32LE(body.length, 0);
  head.write(type, 4);
  return Buffer.concat([head, body]);
};
writeFileSync(output, Buffer.concat([header, chunk(jsonChunk, "JSON"), chunk(bin, "BIN\0")]));
console.log(`filled background of image ${imageArg} (${width}x${height}) → ${output}`);
