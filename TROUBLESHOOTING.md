# 🔧 คู่มือแก้ไขปัญหา - Certificate Auto System

## ❌ Error: `Cannot read properties of undefined (reading 'postData')`

### 🔍 **สาเหตุ:**
- Google Apps Script ยังไม่ได้ Deploy เป็น Web App
- URL ใน `script.js` ยังไม่ถูกต้อง
- Web App ไม่ได้ตั้งค่า permissions ให้ถูกต้อง

### 💡 **วิธีแก้ไข:**

#### 1. ตรวจสอบ Google Apps Script Deploy
1. เปิด [Google Apps Script](https://script.google.com)
2. เปิดโปรเจกต์ที่สร้างไว้
3. คลิก **"Deploy"** → **"Manage deployments"**
4. ถ้าไม่มี deployment ให้สร้างใหม่:
   - คลิก **"Create deployment"**
   - เลือก type: **"Web app"**
   - Execute as: **"Me"**
   - Who has access: **"Anyone"**
   - คลิก **"Deploy"**

#### 2. คัดลอก Web App URL
1. หลังจาก Deploy แล้ว จะได้ URL ที่มีรูปแบบ:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
2. คัดลอก URL นี้

#### 3. อัปเดตไฟล์ script.js
1. เปิดไฟล์ `script.js`
2. ค้นหาบรรทัด:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. แทนที่ด้วย URL ที่คัดลอกมา:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec';
   ```

#### 4. ทดสอบ Google Apps Script
1. ในหน้า Google Apps Script
2. เลือกฟังก์ชัน `testFormSubmission`
3. คลิก **"Run"** (▶️)
4. ตรวจสอบ logs ว่าทำงานได้ไหม

---

## ❌ Error: `Permission denied`

### 🔍 **สาเหตุ:**
Google Apps Script ยังไม่ได้รับสิทธิ์ในการเข้าถึง Google Services

### 💡 **วิธีแก้ไข:**
1. รันฟังก์ชัน `testFormSubmission` ใน Google Apps Script
2. คลิก **"Review permissions"**
3. เลือกบัญชี Google ของคุณ
4. คลิก **"Advanced"** → **"Go to [Project Name] (unsafe)"**
5. คลิก **"Allow"**

---

## ❌ ไม่ได้รับอีเมลใบประกาศนียบัตร

### 🔍 **สาเหตุ:**
- อีเมลถูกส่งไปที่ Spam folder
- Gmail API ยังไม่ได้รับสิทธิ์
- Template ใบประกาศนียบัตรมีปัญหา

### 💡 **วิธีแก้ไข:**
1. **ตรวจสอบ Spam folder** ในอีเมล
2. **ตรวจสอบ execution logs:**
   - ไปที่ Google Apps Script
   - คลิก **"Executions"**
   - ดูรายละเอียด error
3. **ตรวจสอบ Template:**
   - เปิด Google Slides template
   - ตรวจสอบว่ามี `<name>` placeholder หรือไม่
   - ลองแก้ไขเป็น `<Name>` หรือ `<NAME>`

---

## ❌ ข้อมูลไม่เข้า Google Sheets

### 🔍 **สาเหตุ:**
- Spreadsheet ID ไม่ถูกต้อง
- Google Sheets ไม่ได้รับสิทธิ์
- Headers ไม่ตรงกับข้อมูล

### 💡 **วิธีแก้ไข:**
1. **ตรวจสอบ Spreadsheet ID:**
   ```javascript
   const SPREADSHEET_ID = '1GUrL1nOCPGo_M7rLFDud-ZRYWry15FFlSMMAEMT1MiU';
   ```
2. **เปิด Google Sheets ด้วยลิงค์:**
   ```
   https://docs.google.com/spreadsheets/d/1GUrL1nOCPGo_M7rLFDud-ZRYWry15FFlSMMAEMT1MiU/edit
   ```
3. **ลบ header row เดิม** และให้ระบบสร้างใหม่
4. **ทดสอบด้วย `testFormSubmission`**

---

## ❌ Error: `CORS` หรือ Network Error

### 🔍 **สาเหตุ:**
Browser block การเรียก Google Apps Script จากไฟล์ local

### 💡 **วิธีแก้ไข:**
1. **ใช้ Local Server:**
   ```bash
   # ถ้ามี Python
   python -m http.server 8000
   
   # หรือใช้ VS Code Live Server extension
   ```
2. **เปิดเว็บผ่าน http://localhost:8000**
3. **หรือ upload ไฟล์ไปยัง web hosting**

---

## 🔍 วิธีการ Debug

### 1. ตรวจสอบ Browser Console
```javascript
// เปิด Developer Tools (F12)
// ดู Console tab สำหรับ JavaScript errors
```

### 2. ตรวจสอบ Google Apps Script Logs
```javascript
// ใน Google Apps Script
// ไปที่ "Executions" tab
// ดู execution history และ error logs
```

### 3. ทดสอบแบบทีละส่วน
```javascript
// 1. ทดสอบ Google Apps Script ก่อน
function testBasic() {
  console.log('Google Apps Script is working!');
  return 'Success';
}

// 2. ทดสอบ Google Sheets
function testSheets() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  console.log('Sheet name:', sheet.getName());
}

// 3. ทดสอบ Google Drive
function testDrive() {
  const folder = DriveApp.getFolderById(CERTIFICATE_FOLDER_ID);
  console.log('Folder name:', folder.getName());
}
```

---

## 📋 Checklist การแก้ไขปัญหา

### ✅ **ขั้นตอนที่ 1: Google Apps Script**
- [ ] โค้ดถูกคัดลอกครบถ้วน
- [ ] IDs ถูกอัปเดตแล้ว (Sheets, Slides, Drive)
- [ ] Deploy เป็น Web App แล้ว
- [ ] ได้รับสิทธิ์ทั้งหมดแล้ว
- [ ] ทดสอบ `testFormSubmission()` สำเร็จ

### ✅ **ขั้นตอนที่ 2: Frontend**
- [ ] Web App URL ถูกอัปเดตใน `script.js`
- [ ] เปิดผ่าน local server (ไม่ใช่ไฟล์ตรง)
- [ ] Form validation ทำงาน
- [ ] Console ไม่มี JavaScript errors

### ✅ **ขั้นตอนที่ 3: Google Services**
- [ ] Google Sheets เปิดได้และว่าง
- [ ] Google Slides template มี `<name>`
- [ ] Google Drive folder มีสิทธิ์เข้าถึง
- [ ] Gmail สามารถส่งอีเมลได้

---

## 🆘 ถ้ายังแก้ไม่ได้

1. **ลอง Deploy Google Apps Script ใหม่:**
   - Create new deployment
   - เปลี่ยน version เป็น "New"
   - Copy URL ใหม่ไปใส่ใน `script.js`

2. **สร้าง Google Apps Script Project ใหม่:**
   - Copy โค้ดไปใส่ project ใหม่
   - Deploy ใหม่
   - อัปเดต URL

3. **ตรวจสอบ Browser:**
   - ลองใช้ browser อื่น
   - เปิด Incognito/Private mode
   - Clear browser cache

**🔥 หากยังไม่ได้ ให้ส่งรูป error console มาดูเพิ่มเติม!**