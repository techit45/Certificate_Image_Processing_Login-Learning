// Google Apps Script for handling form submissions and certificate generation
// Deploy this as a Web App with permissions for anyone to execute

// Configuration - Update these with your actual IDs
const SPREADSHEET_ID = '1GUrL1nOCPGo_M7rLFDud-ZRYWry15FFlSMMAEMT1MiU';
const CERTIFICATE_TEMPLATE_ID = '1a1EXoY3cx0MIDN2Z-KiAc39NI4AKCk6hyOpp8xinKeg';
const CERTIFICATE_FOLDER_ID = '1iNooK4frWpkrfhVD3D2UDyPrWA44ydg5'; // Main folder to save certificates

// Grade level folder mapping - these will be created automatically if they don't exist
const GRADE_FOLDERS = {
  'M1': null, // Will be populated with actual folder IDs
  'M2': null,
  'M3': null,
  'M4': null,
  'M5': null,
  'M6': null
};

// Main function to handle POST requests from the web form
function doPost(e) {
  try {
    // Check if e and e.parameter/postData exist
    if (!e) {
      throw new Error('No data received. Please check if this is being called as a web app.');
    }
    
    let data;
    
    // Try to get data from different sources
    if (e.parameter && e.parameter.firstName) {
      // Data sent as individual form fields
      data = {
        firstName: e.parameter.firstName,
        lastName: e.parameter.lastName,
        email: e.parameter.email,
        gradeLevel: e.parameter.gradeLevel,
        contentRating: e.parameter.contentRating,
        instructorRating: e.parameter.instructorRating,
        durationRating: e.parameter.durationRating,
        recommendRating: e.parameter.recommendRating,
        practicalRating: e.parameter.practicalRating,
        toolsRating: e.parameter.toolsRating,
        practicalUseRating: e.parameter.practicalUseRating,
        groupSizeRating: e.parameter.groupSizeRating,
        improvements: e.parameter.improvements || '',
        additionalComments: e.parameter.additionalComments || '',
        submissionTime: e.parameter.submissionTime,
        course: e.parameter.course,
        fullName: e.parameter.fullName,
        averageRating: e.parameter.averageRating
      };
    } else if (e.parameter && e.parameter.data) {
      // Data sent as JSON string parameter
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      // Data sent as POST body
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        // If not JSON, try to parse as form data
        const params = new URLSearchParams(e.postData.contents);
        data = Object.fromEntries(params);
      }
    } else {
      throw new Error('No valid data found in request');
    }
    
    console.log('Received data:', data);
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.gradeLevel) {
      throw new Error('Missing required fields: firstName, lastName, email, or gradeLevel');
    }
    
    console.log('Received data:', data);
    
    // Save evaluation data to Google Sheets
    const sheetResult = saveToGoogleSheets(data);
    console.log('Sheet result:', sheetResult);
    
    // Generate and send certificate
    const certificateResult = generateAndSendCertificate(data);
    console.log('Certificate result:', certificateResult);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Form submitted successfully. Certificate will be sent shortly.',
        sheetResult: sheetResult,
        certificateResult: certificateResult
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        stack: error.stack || 'No stack trace available'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for CORS workaround and JSONP)
function doGet(e) {
  try {
    // Check if this is a form submission or JSONP request with data
    let data = null;
    let callback = null;
    
    if (e.parameter && e.parameter.firstName) {
      // Data sent as individual form fields
      data = {
        firstName: e.parameter.firstName,
        lastName: e.parameter.lastName,
        email: e.parameter.email,
        gradeLevel: e.parameter.gradeLevel,
        contentRating: e.parameter.contentRating,
        instructorRating: e.parameter.instructorRating,
        durationRating: e.parameter.durationRating,
        recommendRating: e.parameter.recommendRating,
        practicalRating: e.parameter.practicalRating,
        toolsRating: e.parameter.toolsRating,
        practicalUseRating: e.parameter.practicalUseRating,
        groupSizeRating: e.parameter.groupSizeRating,
        improvements: e.parameter.improvements || '',
        additionalComments: e.parameter.additionalComments || '',
        submissionTime: e.parameter.submissionTime,
        course: e.parameter.course,
        fullName: e.parameter.fullName,
        averageRating: e.parameter.averageRating
      };
      callback = e.parameter.callback;
    } else if (e.parameter && e.parameter.data && e.parameter.callback) {
      // Parse the JSON data
      data = JSON.parse(e.parameter.data);
      callback = e.parameter.callback;
    }
    
    if (data) {
      // Validate required fields
      if (!data.firstName || !data.lastName || !data.email || !data.gradeLevel) {
        const errorResponse = {
          success: false,
          error: 'Missing required fields: firstName, lastName, email, or gradeLevel'
        };
        
        if (callback) {
          return ContentService
            .createTextOutput(`${callback}(${JSON.stringify(errorResponse)})`)
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
        } else {
          return ContentService
            .createTextOutput(JSON.stringify(errorResponse))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      console.log('Received data via GET:', data);
      
      // Save evaluation data to Google Sheets
      const sheetResult = saveToGoogleSheets(data);
      console.log('Sheet result:', sheetResult);
      
      // Generate and send certificate
      const certificateResult = generateAndSendCertificate(data);
      console.log('Certificate result:', certificateResult);
      
      const response = {
        success: true,
        message: 'Form submitted successfully. Certificate will be sent shortly.',
        sheetResult: sheetResult,
        certificateResult: certificateResult
      };
      
      // Return response (JSONP if callback provided)
      if (callback) {
        return ContentService
          .createTextOutput(`${callback}(${JSON.stringify(response)})`)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService
          .createTextOutput(JSON.stringify(response))
          .setMimeType(ContentService.MimeType.JSON);
      }
        
    } else {
      // Regular GET request
      const output = ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'GET request received. Include data and callback parameters for JSONP submission.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
      return output;
    }
    
  } catch (error) {
    console.error('Error in doGet:', error);
    
    const errorResponse = {
      success: false,
      error: error.toString(),
      stack: error.stack || 'No stack trace available'
    };
    
    // If callback is provided, return JSONP error
    if (e.parameter && e.parameter.callback) {
      return ContentService
        .createTextOutput(`${e.parameter.callback}(${JSON.stringify(errorResponse)})`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to save evaluation data to Google Sheets
function saveToGoogleSheets(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'First Name',
        'Last Name', 
        'Full Name',
        'Email',
        'Grade Level',
        'Course',
        'Content Rating',
        'Instructor Rating',
        'Duration Rating',
        'Recommend Rating',
        'Practical Rating',
        'Tools Rating',
        'Practical Use Rating',
        'Group Size Rating',
        'Overall Average Rating',
        'Core Average Rating',
        'Practical Average Rating',
        'Improvements',
        'Additional Comments',
        'Certificate Generated',
        'Certificate Sent',
        'Certificate File Path'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4facfe');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // Calculate different types of average ratings
    const coreRatings = [
      parseInt(data.contentRating),
      parseInt(data.instructorRating),
      parseInt(data.durationRating),
      parseInt(data.recommendRating)
    ];
    
    const practicalRatings = [
      parseInt(data.practicalRating),
      parseInt(data.toolsRating),
      parseInt(data.practicalUseRating),
      parseInt(data.groupSizeRating)
    ];
    
    const allRatings = [...coreRatings, ...practicalRatings];
    
    const overallAverageRating = (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2);
    const coreAverageRating = (coreRatings.reduce((a, b) => a + b, 0) / coreRatings.length).toFixed(2);
    const practicalAverageRating = (practicalRatings.reduce((a, b) => a + b, 0) / practicalRatings.length).toFixed(2);
    
    // Prepare row data
    const rowData = [
      data.submissionTime,
      data.firstName,
      data.lastName,
      data.fullName,
      data.email,
      data.gradeLevel,
      data.course,
      data.contentRating,
      data.instructorRating,
      data.durationRating,
      data.recommendRating,
      data.practicalRating,
      data.toolsRating,
      data.practicalUseRating,
      data.groupSizeRating,
      overallAverageRating,
      coreAverageRating,
      practicalAverageRating,
      data.improvements,
      data.additionalComments,
      'Pending',
      'Pending',
      ''
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Get the row number of the newly added data
    const lastRow = sheet.getLastRow();
    
    return {
      success: true,
      rowNumber: lastRow,
      overallAverageRating: overallAverageRating,
      coreAverageRating: coreAverageRating,
      practicalAverageRating: practicalAverageRating
    };
    
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw new Error('Failed to save data to spreadsheet: ' + error.toString());
  }
}

// Function to get or create grade-specific folder
function getOrCreateGradeFolder(gradeLevel) {
  try {
    const mainFolder = DriveApp.getFolderById(CERTIFICATE_FOLDER_ID);
    const gradeFolderName = `${gradeLevel} - มัธยมศึกษาปีที่ ${gradeLevel.substring(1)}`;
    
    // Check if grade folder already exists
    const existingFolders = mainFolder.getFoldersByName(gradeFolderName);
    if (existingFolders.hasNext()) {
      return existingFolders.next();
    }
    
    // Create new grade folder if it doesn't exist
    const newFolder = mainFolder.createFolder(gradeFolderName);
    console.log(`Created new grade folder: ${gradeFolderName}`);
    return newFolder;
    
  } catch (error) {
    console.error('Error creating grade folder:', error);
    // Fallback to main folder if there's an error
    return DriveApp.getFolderById(CERTIFICATE_FOLDER_ID);
  }
}

// Function to generate certificate and send via email
function generateAndSendCertificate(data) {
  try {
    // Create a copy of the certificate template
    const templateFile = DriveApp.getFileById(CERTIFICATE_TEMPLATE_ID);
    const certificateName = `${data.gradeLevel}_${data.firstName}_${data.lastName}_Certificate_${new Date().getTime()}`;
    
    // Get or create grade-specific folder
    const folder = getOrCreateGradeFolder(data.gradeLevel);
    
    const certificateFile = templateFile.makeCopy(certificateName, folder);
    
    // Open the copied presentation
    const presentation = SlidesApp.openById(certificateFile.getId());
    const slides = presentation.getSlides();
    
    if (slides.length === 0) {
      throw new Error('Certificate template has no slides');
    }
    
    // Replace placeholders in the first slide
    const slide = slides[0];
    const elements = slide.getPageElements();
    
    // Define replacement mappings
    const replacements = {
      '<name>': data.fullName,
      '<Name>': data.fullName,
      '<NAME>': data.fullName.toUpperCase(),
      '<course>': data.course,
      '<Course>': data.course,
      '<COURSE>': data.course.toUpperCase(),
      '<date>': new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      '<Date>': new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    // Iterate through all elements and replace text
    elements.forEach(element => {
      if (element.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
        const shape = element.asShape();
        if (shape.getText) {
          const textRange = shape.getText();
          let text = textRange.asString();
          
          // Replace all placeholders
          Object.keys(replacements).forEach(placeholder => {
            text = text.replace(new RegExp(placeholder, 'g'), replacements[placeholder]);
          });
          
          textRange.setText(text);
        }
      }
    });
    
    // Save the presentation
    presentation.saveAndClose();
    
    // Export as PDF
    const pdfBlob = DriveApp.getFileById(certificateFile.getId()).getAs('application/pdf');
    pdfBlob.setName(`${certificateName}.pdf`);
    
    // Send email with certificate
    const emailResult = sendCertificateEmail(data, pdfBlob);
    
    // Update the spreadsheet to mark certificate as generated and sent
    updateCertificateStatus(data, true, emailResult.success);
    
    // Clean up the Google Slides file (optional, keep PDF only)
    // DriveApp.getFileById(certificateFile.getId()).setTrashed(true);
    
    // Update spreadsheet with certificate file path
    updateCertificateFilePath(data, `/${data.gradeLevel}/${certificateName}.pdf`);
    
    return {
      success: true,
      certificateId: certificateFile.getId(),
      emailSent: emailResult.success,
      fileName: `${certificateName}.pdf`,
      gradeFolder: folder.getName(),
      filePath: `/${data.gradeLevel}/${certificateName}.pdf`
    };
    
  } catch (error) {
    console.error('Error generating certificate:', error);
    
    // Update spreadsheet to mark certificate generation as failed
    updateCertificateStatus(data, false, false);
    
    throw new Error('Failed to generate certificate: ' + error.toString());
  }
}

// Function to send certificate via email
function sendCertificateEmail(data, pdfBlob) {
  try {
    const subject = `🎉 ใบประกาศนียบัตรหลักสูตร ${data.course}`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #4facfe 100%); color: white; text-align: center; padding: 40px; border-radius: 15px 15px 0 0;">
          <div style="font-size: 3em; margin-bottom: 15px;">🎓📊🔬</div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">ยินดีด้วย!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">คุณได้รับใบประกาศนียบัตรแล้ว</p>
          <div style="background: rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 20px; margin-top: 15px; display: inline-block;">
            <strong>Image Processing Workshop</strong>
          </div>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333;">เรียน คุณ <strong style="color: #1e3c72;">${data.fullName}</strong>,</p>
          
          <p style="line-height: 1.6;">ขอแสดงความยินดีที่คุณได้ทำการประเมินหลักสูตร <strong style="color: #4facfe;">${data.course}</strong> เรียบร้อยแล้ว</p>
          
          <p style="line-height: 1.6;">กรุณาดาวน์โหลดใบประกาศนียบัตรของคุณในไฟล์แนบ</p>
          
          <div style="background: linear-gradient(135deg, #f8f9fa, #e3f2fd); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #4facfe;">
            <h3 style="margin: 0 0 15px 0; color: #1e3c72; display: flex; align-items: center;">📊 สรุปการประเมินของคุณ:</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <h4 style="color: #2a5298; margin: 0 0 8px 0;">📚 ด้านเนื้อหาและการสอน</h4>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>เนื้อหาหลักสูตร: <strong>${data.contentRating}/5</strong></li>
                  <li>ผู้สอน: <strong>${data.instructorRating}/5</strong></li>
                  <li>ระยะเวลา: <strong>${data.durationRating}/5</strong></li>
                  <li>โอกาสแนะนำ: <strong>${data.recommendRating}/5</strong></li>
                </ul>
              </div>
              
              <div>
                <h4 style="color: #2a5298; margin: 0 0 8px 0;">💻 ด้านปฏิบัติและเครื่องมือ</h4>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>การปฏิบัติ: <strong>${data.practicalRating}/5</strong></li>
                  <li>เครื่องมือ/Software: <strong>${data.toolsRating}/5</strong></li>
                  <li>การใช้งานจริง: <strong>${data.practicalUseRating}/5</strong></li>
                  <li>ขนาดกลุ่ม: <strong>${data.groupSizeRating}/5</strong></li>
                </ul>
              </div>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 18px;"><strong>คะแนนรวมเฉลี่ย: ${data.averageRating || 'N/A'}/5</strong></p>
            </div>
          </div>
          
          <p style="line-height: 1.6; color: #666;">ขอบคุณสำหรับการประเมินและข้อเสนอแนะที่มีค่า เราจะนำไปพัฒนาหลักสูตรให้ดีขึ้นต่อไป</p>
          
          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #1e3c72;">
              <strong>ทีมงานหลักสูตร ${data.course}</strong><br>
              <span style="font-size: 14px; color: #666;">Color Segmentation & Computer Vision</span>
            </p>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #1e3c72, #4facfe); text-align: center; padding: 20px; border-radius: 0 0 15px 15px; color: white;">
          <p style="margin: 0; opacity: 0.9;">หากมีข้อสอบถาม กรุณาติดต่อเจ้าหน้าที่</p>
        </div>
      </div>
    `;
    
    const plainBody = `
      ยินดีด้วย! คุณ ${data.fullName}
      
      คุณได้รับใบประกาศนียบัตรหลักสูตร ${data.course} แล้ว
      
      สรุปการประเมินของคุณ:
      
      ด้านเนื้อหาและการสอน:
      - เนื้อหาหลักสูตร: ${data.contentRating}/5
      - ผู้สอน: ${data.instructorRating}/5  
      - ระยะเวลา: ${data.durationRating}/5
      - โอกาสแนะนำ: ${data.recommendRating}/5
      
      ด้านปฏิบัติและเครื่องมือ:
      - การปฏิบัติ: ${data.practicalRating}/5
      - เครื่องมือ/Software: ${data.toolsRating}/5
      - การใช้งานจริง: ${data.practicalUseRating}/5
      - ขนาดกลุ่ม: ${data.groupSizeRating}/5
      
      คะแนนรวมเฉลี่ย: ${data.averageRating || 'N/A'}/5
      
      ขอบคุณสำหรับการประเมินและข้อเสนอแนะที่มีค่า
      
      ทีมงานหลักสูตร ${data.course}
      Color Segmentation & Computer Vision
    `;
    
    // Send email with attachment
    GmailApp.sendEmail(
      data.email,
      subject,
      plainBody,
      {
        htmlBody: htmlBody,
        attachments: [pdfBlob],
        name: `ทีมงานหลักสูตร ${data.course}`
      }
    );
    
    return { success: true };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error.toString() 
    };
  }
}

// Function to update certificate status in spreadsheet
function updateCertificateStatus(data, certificateGenerated, emailSent) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // Find the row with matching email (assuming it's the most recent entry)
    const emailCol = 5; // Column E (Email)
    const certGenCol = 21; // Column U (Certificate Generated) - adjusted for new columns
    const certSentCol = 22; // Column V (Certificate Sent) - adjusted for new columns
    
    for (let row = lastRow; row >= 2; row--) {
      const emailInSheet = sheet.getRange(row, emailCol).getValue();
      if (emailInSheet === data.email) {
        // Update certificate status
        sheet.getRange(row, certGenCol).setValue(certificateGenerated ? 'Yes' : 'Failed');
        sheet.getRange(row, certSentCol).setValue(emailSent ? 'Yes' : 'Failed');
        break;
      }
    }
    
  } catch (error) {
    console.error('Error updating certificate status:', error);
  }
}

// Function to update certificate file path in spreadsheet
function updateCertificateFilePath(data, filePath) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // Find the row with matching email (assuming it's the most recent entry)
    const emailCol = 5; // Column E (Email)
    const filePathCol = 23; // Column W (Certificate File Path)
    
    for (let row = lastRow; row >= 2; row--) {
      const emailInSheet = sheet.getRange(row, emailCol).getValue();
      if (emailInSheet === data.email) {
        // Update file path
        sheet.getRange(row, filePathCol).setValue(filePath);
        break;
      }
    }
    
  } catch (error) {
    console.error('Error updating certificate file path:', error);
  }
}

// Test function (for debugging)
function testFormSubmission() {
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'test@example.com',
    gradeLevel: 'M3',
    course: 'Image Processing',
    contentRating: '5',
    instructorRating: '5',
    durationRating: '4',
    recommendRating: '5',
    practicalRating: '5',
    toolsRating: '4',
    practicalUseRating: '5',
    groupSizeRating: '4',
    averageRating: '4.6',
    improvements: 'Great course!',
    additionalComments: 'Thank you',
    submissionTime: new Date().toLocaleString()
  };
  
  try {
    const result = JSON.parse(doPost({
      postData: {
        contents: JSON.stringify(testData)
      }
    }).getContent());
    
    console.log('Test result:', result);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}