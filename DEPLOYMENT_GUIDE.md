# คู่มือการ Deploy ระบบแบบประเมินและออกใบประกาศนียบัตร

## ข้อมูลที่ได้รับจากผู้ใช้

✅ **Google Slides Template**: `1a1EXoY3cx0MIDN2Z-KiAc39NI4AKCk6hyOpp8xinKeg`
✅ **Google Drive Folder**: `1iNooK4frWpkrfhVD3D2UDyPrWA44ydg5` 
✅ **Google Sheets**: `1GUrL1nOCPGo_M7rLFDud-ZRYWry15FFlSMMAEMT1MiU`

## ขั้นตอนการ Deploy

### 1. Deploy Google Apps Script

1. ไปที่ [Google Apps Script](https://script.google.com)
2. สร้างโปรเจกต์ใหม่ โดยคลิก **"New project"**
3. ลบโค้ดเดิมทั้งหมด และคัดลอกโค้ดจาก `google-apps-script.js` ทั้งหมด
4. บันทึกโปรเจกต์ (Ctrl+S) และตั้งชื่อว่า **"Image Processing Certificate System"**

### 2. ให้สิทธิ์ Google Apps Script

1. ในหน้า Google Apps Script คลิกที่ **"Run"** (▶️) เพื่อทดสอบ
2. ระบบจะขอสิทธิ์ ให้คลิก **"Review permissions"**
3. เลือกบัญชี Google ของคุณ
4. คลิก **"Advanced"** → **"Go to [Project Name] (unsafe)"**
5. คลิก **"Allow"** เพื่อให้สิทธิ์:
   - อ่าน/เขียน Google Sheets
   - อ่าน/เขียน Google Slides
   - อ่าน/เขียน Google Drive
   - ส่งอีเมลผ่าน Gmail

### 3. Deploy เป็น Web App

1. คลิกที่ **"Deploy"** → **"New deployment"**
2. คลิกที่ไอคอนเฟือง ⚙️ และเลือก **"Web app"**
3. ตั้งค่าดังนี้:
   - **Description**: `Image Processing Certificate API v1.0`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone`
4. คลิก **"Deploy"**
5. **คัดลอก Web App URL** ที่ได้ (จะใช้ในขั้นตอนถัดไป)

### 4. อัปเดต URL ในไฟล์ JavaScript

1. เปิดไฟล์ `script.js` 
2. ค้นหาบรรทัด:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. แทนที่ด้วย Web App URL ที่ได้จากขั้นตอนที่ 3:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### 5. ทดสอบระบบ

1. เปิดไฟล์ `index.html` ในเบราว์เซอร์
2. กรอกข้อมูลทดสอบ:
   - ชื่อ: `John`
   - นามสกุล: `Doe` 
   - อีเมล: อีเมลจริงของคุณ
   - ประเมินทุกข้อ
3. คลิก **"ส่งแบบประเมินและรับใบประกาศนียบัตร"**
4. ตรวจสอบ:
   - ข้อมูลถูกบันทึกใน Google Sheets หรือไม่
   - อีเมลที่มีใบประกาศนียบัตรถูกส่งหรือไม่
   - ใบประกาศนียบัตรมีชื่อ "John Doe" หรือไม่

## การแก้ไขปัญหา

### ❌ ปัญหา: ไม่สามารถส่งแบบประเมินได้

**วิธีแก้:**
1. กดF12 เปิด Developer Tools
2. ดู Console มี error อะไร
3. ตรวจสอบ Web App URL ใน `script.js` ว่าถูกต้อง
4. ตรวจสอบว่า Google Apps Script ได้รับสิทธิ์แล้ว

### ❌ ปัญหา: ไม่ได้รับอีเมล

**วิธีแก้:**
1. ตรวจสอบ Spam/Junk folder
2. ใน Google Apps Script ไปที่ **"Executions"** ดู error logs
3. ตรวจสอบว่าอีเมลที่กรอกถูกต้อง

### ❌ ปัญหา: ใบประกาศนียบัตรไม่มีชื่อ

**วิธีแก้:**
1. ตรวจสอบ Google Slides Template ว่ามี `<name>` placeholder
2. ตรวจสอบว่า CERTIFICATE_TEMPLATE_ID ถูกต้อง

### ❌ ปัญหา: Permission denied

**วิธีแก้:**
1. ไปที่ Google Apps Script
2. รันฟังก์ชัน `testFormSubmission()` เพื่อให้สิทธิ์ใหม่
3. หรือลองสร้าง Google Apps Script โปรเจกต์ใหม่

## ข้อมูลเพิ่มเติม

### IDs ที่ใช้ในระบบ:
- **Google Sheets ID**: `1GUrL1nOCPGo_M7rLFDud-ZRYWry15FFlSMMAEMT1MiU`
- **Google Slides Template ID**: `1a1EXoY3cx0MIDN2Z-KiAc39NI4AKCk6hyOpp8xinKeg`
- **Google Drive Folder ID**: `1iNooK4frWpkrfhVD3D2UDyPrWA44ydg5`

### โครงสร้างข้อมูลใน Google Sheets:
1. Timestamp
2. First Name
3. Last Name
4. Full Name
5. Email
6. **Grade Level** (M1-M6) 🆕
7. Course
8. Content Rating (1-5)
9. Instructor Rating (1-5)
10. Duration Rating (1-5)
11. Recommend Rating (1-5)
12. Practical Rating (1-5)
13. Tools Rating (1-5)
14. Practical Use Rating (1-5)
15. Group Size Rating (1-5)
16. Overall Average Rating
17. Core Average Rating
18. Practical Average Rating
19. Improvements (text)
20. Additional Comments (text)
21. Certificate Generated (Yes/No/Failed)
22. Certificate Sent (Yes/No/Failed)
23. **Certificate File Path** 🆕

### 🗂️ โครงสร้างโฟลเดอร์ใน Google Drive (สร้างอัตโนมัติ):
```
📁 Image Processing Certificates (Main Folder)
├── 📁 M1 - มัธยมศึกษาปีที่ 1
├── 📁 M2 - มัธยมศึกษาปีที่ 2  
├── 📁 M3 - มัธยมศึกษาปีที่ 3
├── 📁 M4 - มัธยมศึกษาปีที่ 4
├── 📁 M5 - มัธยมศึกษาปีที่ 5
└── 📁 M6 - มัธยมศึกษาปีที่ 6
```

### 📋 รูปแบบชื่อไฟล์ใบประกาศนียบัตร:
```
{ระดับชั้น}_{ชื่อ}_{นามสกุล}_Certificate_{timestamp}
ตัวอย่าง: M3_John_Doe_Certificate_1704067200000.pdf
```

### คุณสมบัติของระบบ:
- ✅ แบบประเมิน 8 หัวข้อละเอียด
- ✅ UI/UX ธีม Image Processing สีน้ำเงิน
- ✅ **Dropdown ระดับชั้น M1-M6** 🆕
- ✅ Responsive design (มือถือ + เดสก์ท็อป)
- ✅ Real-time validation
- ✅ คำนวณคะแนนเฉลี่ยหลายแบบ
- ✅ ส่งใบประกาศนียบัตร PDF ทางอีเมล
- ✅ เก็บข้อมูลใน Google Sheets
- ✅ ใบประกาศนียบัตรแทนที่ชื่อแบบอัตโนมัติ
- ✅ **จัดเก็บใบประกาศนียบัตรแยกโฟลเดอร์ตามระดับชั้น** 🆕
- ✅ **ตั้งชื่อไฟล์ตามรูปแบบ: ระดับ_ชื่อ_นามสกุล** 🆕

**🎉 ระบบพร้อมใช้งานแล้ว!**