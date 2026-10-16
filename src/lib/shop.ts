// ข้อมูลร้าน — แก้ชื่อร้านและลิงก์แชตที่นี่ที่เดียว
export const shop = {
  name: "BELLUX",
  tagline: "Autumn Collection 2026",
  lineUrl: "https://line.me/R/ti/p/@yourshop",
  instagramUrl: "https://ig.me/m/yourshop",
};

export function formatPrice(amount: number) {
  return `฿${amount.toLocaleString("en-US")}`;
}
