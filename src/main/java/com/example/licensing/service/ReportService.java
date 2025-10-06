package com.example.licensing.service;

import com.example.licensing.license.License;
import com.example.licensing.license.LicenseRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.opencsv.CSVWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private LicenseRepository licenseRepository;

    public byte[] generatePdfReport() throws Exception {
        List<License> licenses = licenseRepository.findAll();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Title
        Paragraph title = new Paragraph("License Management Report")
                .setFontSize(18)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER);
        document.add(title);
        
        Paragraph date = new Paragraph("Generated: " + LocalDate.now())
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(date);
        
        document.add(new Paragraph("\n"));

        // Table
        float[] columnWidths = {2, 2, 2, 2, 3, 3, 2};
        Table table = new Table(columnWidths);
        table.setWidth(500);

        // Headers
        String[] headers = {"Company", "Type", "Issue Date", "Expiry Date", "Application Fee", "License Fee", "Years to Expiry"};
        for (String header : headers) {
            com.itextpdf.layout.element.Cell cell = new com.itextpdf.layout.element.Cell().add(new Paragraph(header).setBold());
            cell.setBackgroundColor(com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY);
            table.addHeaderCell(cell);
        }

        // Data rows
        for (License license : licenses) {
            table.addCell(license.getCompanyName());
            table.addCell(license.getType().toString());
            table.addCell(license.getIssueDate().toString());
            table.addCell(license.getExpiryDate().toString());
            table.addCell(formatCurrency(license.getApplicationFee()));
            table.addCell(formatCurrency(license.getLicenseFee()));
            table.addCell(String.valueOf(license.yearsBeforeExpiry(LocalDate.now())));
        }

        document.add(table);
        document.close();
        
        return baos.toByteArray();
    }

    public byte[] generateExcelReport() throws Exception {
        List<License> licenses = licenseRepository.findAll();
        
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Licenses");

        // Create header style
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Company Name", "Type", "Email", "Issue Date", "Expiry Date", 
                           "Validity Years", "Application Fee", "License Fee", "Annual Frequency Fee", 
                           "Annual USC", "Latitude", "Longitude", "Years to Expiry"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Create data rows
        int rowNum = 1;
        for (License license : licenses) {
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(license.getId());
            row.createCell(1).setCellValue(license.getCompanyName());
            row.createCell(2).setCellValue(license.getType().toString());
            row.createCell(3).setCellValue(license.getEmail());
            row.createCell(4).setCellValue(license.getIssueDate().toString());
            row.createCell(5).setCellValue(license.getExpiryDate().toString());
            row.createCell(6).setCellValue(license.getValidityYears() != null ? license.getValidityYears() : 15);
            row.createCell(7).setCellValue(formatCurrency(license.getApplicationFee()));
            row.createCell(8).setCellValue(formatCurrency(license.getLicenseFee()));
            row.createCell(9).setCellValue(formatCurrency(license.getAnnualFrequencyFee()));
            row.createCell(10).setCellValue(formatCurrency(license.getAnnualUniversalServiceContribution()));
            row.createCell(11).setCellValue(license.getLatitude() != null ? license.getLatitude() : 0);
            row.createCell(12).setCellValue(license.getLongitude() != null ? license.getLongitude() : 0);
            row.createCell(13).setCellValue(license.yearsBeforeExpiry(LocalDate.now()));
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        workbook.write(baos);
        workbook.close();
        
        return baos.toByteArray();
    }

    public byte[] generateCsvReport() throws Exception {
        List<License> licenses = licenseRepository.findAll();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        OutputStreamWriter osw = new OutputStreamWriter(baos);
        CSVWriter writer = new CSVWriter(osw);

        // Write headers
        String[] headers = {"ID", "Company Name", "Type", "Email", "Issue Date", "Expiry Date", 
                           "Validity Years", "Application Fee", "License Fee", "Annual Frequency Fee", 
                           "Annual USC", "Latitude", "Longitude", "Years to Expiry"};
        writer.writeNext(headers);

        // Write data
        for (License license : licenses) {
            String[] data = {
                String.valueOf(license.getId()),
                license.getCompanyName(),
                license.getType().toString(),
                license.getEmail(),
                license.getIssueDate().toString(),
                license.getExpiryDate().toString(),
                String.valueOf(license.getValidityYears() != null ? license.getValidityYears() : 15),
                formatCurrency(license.getApplicationFee()),
                formatCurrency(license.getLicenseFee()),
                formatCurrency(license.getAnnualFrequencyFee()),
                formatCurrency(license.getAnnualUniversalServiceContribution()),
                String.valueOf(license.getLatitude() != null ? license.getLatitude() : 0),
                String.valueOf(license.getLongitude() != null ? license.getLongitude() : 0),
                String.valueOf(license.yearsBeforeExpiry(LocalDate.now()))
            };
            writer.writeNext(data);
        }

        writer.close();
        return baos.toByteArray();
    }

    private String formatCurrency(BigDecimal value) {
        if (value == null) return "$0.00";
        return "$" + String.format("%,.2f", value);
    }
}
