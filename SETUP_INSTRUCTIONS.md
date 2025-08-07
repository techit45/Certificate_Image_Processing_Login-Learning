# Setup Instructions - Certificate Auto System

## ระบบแบบประเมินและออกใบประกาศนียบัตรอัตโนมัติ

ระบบนี้จะทำการเก็บข้อมูลการประเมินไปยัง Google Sheets และสร้างใบประกาศนียบัตรบน Google Slides แบบอัตโนมัติ

## ขั้นตอนการติดตั้ง

### 1. สร้าง Google Sheets สำหรับเก็บข้อมูล

1. ไปที่ [Google Sheets](https://sheets.google.com)
2. สร้างสเปรดชีตใหม่
3. ตั้งชื่อว่า "Image Processing Course Evaluation"
4. คัดลอก ID ของสเปรดชีต จาก URL (ส่วนระหว่าง `/d/` และ `/edit`)
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 2. สร้าง Google Slides Template สำหรับใบประกาศนียบัตร

1. ไปที่ [Google Slides](https://slides.google.com)
2. สร้าง Presentation ใหม่
3. ออกแบบใบประกาศนียบัตรสำหรับหลักสูตร "Image Processing"
4. ใส่ placeholder `<name>` ในตำแหน่งที่ต้องการให้แสดงชื่อผู้เรียน
5. ตัวอย่าง template:
   ```
   Certificate of Completion
   
   This is to certify that
   <name>
   has successfully completed the
   Image Processing Course
   
   Date: <date>
   ```
6. คัดลอก ID ของ Google Slides จาก URL
   ```
   https://docs.google.com/presentation/d/[SLIDES_ID]/edit
   ```

### 3. สร้าง Google Drive Folder (ทางเลือก)

1. ไปที่ [Google Drive](https://drive.google.com)
2. สร้างโฟลเดอร์ใหม่สำหรับเก็บใบประกาศนียบัตร
3. ตั้งชื่อว่า "Image Processing Certificates"
4. คัดลอก ID ของโฟลเดอร์จาก URL
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID]
   ```

### 4. ติดตั้ง Google Apps Script

1. ไปที่ [Google Apps Script](https://script.google.com)
2. สร้างโปรเจกต์ใหม่
3. ลบโค้ดเดิมและคัดลอกโค้ดจากไฟล์ `google-apps-script.js`
4. อัปเดตค่า Configuration ต่อไปนี้:
   ```javascript
   const SPREADSHEET_ID = 'ใส่ ID ของ Google Sheets ที่สร้างไว้';
   const CERTIFICATE_TEMPLATE_ID = 'ใส่ ID ของ Google Slides Template';
   const CERTIFICATE_FOLDER_ID = 'ใส่ ID ของโฟลเดอร์ (ทางเลือก)';
   ```
5. บันทึกโปรเจกต์
6. ตั้งชื่อโปรเจกต์ว่า "Certificate Auto System"

### 5. Deploy Google Apps Script เป็น Web App

1. ในหน้า Google Apps Script คลิก "Deploy" > "New deployment"
2. เลือก type เป็น "Web app"
3. ตั้งค่า:
   - Description: "Certificate Auto System API"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. คลิก "Deploy"
5. คัดลอก Web App URL ที่ได้

### 6. อัปเดตไฟล์ JavaScript

1. เปิดไฟล์ `script.js`
2. แทนที่ `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` ด้วย Web App URL ที่คัดลอกมา:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/[SCRIPT_ID]/exec';
   ```

### 7. ให้สิทธิ์ Google Apps Script

เมื่อรันครั้งแรก Google Apps Script จะขอสิทธิ์:
1. คลิก "Review permissions"
2. เลือกบัญชี Google ของคุณ
3. คลิก "Advanced" > "Go to [Project Name] (unsafe)"
4. คลิค "Allow"

สิทธิ์ที่ต้องการ:
- Google Sheets (เขียนข้อมูล)
- Google Slides (สร้างและแก้ไข)
- Google Drive (สร้างไฟล์)
- Gmail (ส่งอีเมล)

### 8. ทดสอบระบบ

1. เปิดไฟล์ `index.html` ในเบราว์เซอร์
2. กรอกข้อมูลทดสอบ
3. ส่งแบบประเมิน
4. ตรวจสอบ:
   - ข้อมูลถูกบันทึกใน Google Sheets
   - ใบประกาศนียบัตรถูกสร้างและส่งทางอีเมล

## การใช้งาน

### สำหรับผู้เรียน:
1. เปิดเว็บไซต์แบบประเมิน
2. กรอกชื่อและนามสกุลเป็นภาษาอังกฤษ
3. กรอกอีเมล
4. ประเมินหลักสูตร
5. ส่งแบบประเมิน
6. รอรับใบประกาศนียบัตรทางอีเมล (5-10 นาที)

### สำหรับผู้ดูแลระบบ:
1. ดูข้อมูลการประเมินใน Google Sheets
2. ตรวจสอบสถานะการส่งใบประกาศนียบัตร
3. ดาวน์โหลดไฟล์ใบประกาศนียบัตรจาก Google Drive

## โครงสร้างไฟล์

```
Certificate_auto/
├── index.html              # หน้าแบบประเมิน
├── style.css              # สไตล์ CSS
├── script.js              # JavaScript สำหรับฟอร์ม
├── google-apps-script.js  # โค้ด Google Apps Script
└── SETUP_INSTRUCTIONS.md  # คู่มือติดตั้ง
```

## การแก้ไขปัญหา

### ปัญหาที่อาจพบ:

1. **ไม่สามารถส่งฟอร์มได้**
   - ตรวจสอบ Web App URL ใน `script.js`
   - ตรวจสอบว่า Google Apps Script ได้รับสิทธิ์แล้ว

2. **ไม่ได้รับอีเมล**
   - ตรวจสอบ Spam folder
   - ตรวจสอบว่าอีเมลถูกต้อง
   - ดู logs ใน Google Apps Script

3. **ใบประกาศนียบัตรไม่ถูกสร้าง**
   - ตรวจสอบ Template ID ใน Google Apps Script
   - ตรวจสอบว่ามี `<name>` placeholder ใน template

4. **ข้อมูลไม่ถูกบันทึกใน Sheets**
   - ตรวจสอบ Spreadsheet ID
   - ตรวจสอบสิทธิ์ Google Sheets

### การดู Logs:
1. ไปที่ Google Apps Script
2. คลิก "Executions" เพื่อดู execution logs
3. ดูรายละเอียด error ถ้ามี

## การปรับแต่ง

### เปลี่ยนหลักสูตร:
1. แก้ไขชื่อหลักสูตรใน `index.html`
2. แก้ไขชื่อหลักสูตรใน `google-apps-script.js`
3. สร้าง Google Slides template ใหม่

### เปลี่ยนคำถามในแบบประเมิน:
1. แก้ไขคำถามใน `index.html`
2. อัปเดตการประมวลผลใน `script.js`
3. อัปเดต headers ใน `google-apps-script.js`

### เปลี่ยนรูปแบบอีเมล:
1. แก้ไขเทมเพลตอีเมลใน function `sendCertificateEmail()`
2. ปรับแต่ง HTML และ plain text

## ความปลอดภัย

- ระบบใช้ HTTPS สำหรับการส่งข้อมูล
- ข้อมูลส่วนตัวเก็บใน Google Sheets ที่มีการควบคุมสิทธิ์
- อีเมลส่งผ่าน Gmail API ที่มีความปลอดภัย
- ไม่มีการเก็บข้อมูลส่วนตัวในเครื่องผู้ใช้