# วิธีแปลง PDF เป็นรูปภาพ (Manual Process)

## ขั้นตอนแปลงไฟล์:

### วิธีที่ 1: ใช้ Google Drive (ฟรี)
1. **เปิดไฟล์ PDF** ใน Google Drive
2. **คลิกขวา** → "เปิดด้วย" → **"Google Drawings"**
3. เมื่อเปิดใน Google Drawings แล้ว:
   - ไฟล์ → ดาวน์โหลด → PNG หรือ JPEG
4. **อัปโหลด** รูปภาพกลับไป Google Drive

### วิธีที่ 2: ใช้ Online Converter (ฟรี)
1. ไปที่ **smallpdf.com/pdf-to-jpg**
2. **อัปโหลด** ไฟล์ PDF จาก Google Drive
3. **ดาวน์โหลด** รูป JPG
4. **อัปโหลด** กลับไป Google Drive

### วิธีที่ 3: ใช้ Google Chrome (ฟรี)
1. **เปิดไฟล์ PDF** ใน Google Chrome
2. **กด** `Ctrl+Shift+I` (Developer Tools)
3. **กด** `Ctrl+Shift+P` → พิมพ์ "screenshot"
4. **เลือก** "Capture full size screenshot"
5. **บันทึก** รูปภาพ

## อัตโนมัติในอนาคต:
- **ใช้ External API** (เช่น CloudConvert)
- **ใช้ Puppeteer** + Node.js server
- **ใช้ Apps Script Add-on** ที่รองรับ

## สำหรับตอนนี้:
ระบบจะสร้าง **PDF ไฟล์คุณภาพสูง** ให้
แล้วคุณสามารถแปลงเป็นรูปภาพด้วยวิธีข้างบนได้