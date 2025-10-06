package com.example.licensing.config;

import com.example.licensing.license.License;
import com.example.licensing.license.LicenseRepository;
import com.example.licensing.license.LicenseType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private LicenseRepository licenseRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (licenseRepository.count() > 0) {
            System.out.println("Database already contains data. Skipping initialization.");
            return;
        }

        System.out.println("Initializing database with sample license data...");

        // Sample CTL Licenses with Zimbabwe coordinates
        createLicense(
            "Econet Wireless Zimbabwe",
            LicenseType.CTL,
            "info@econet.co.zw",
            LocalDate.of(2020, 3, 15),
            null, // CTL has fixed 15 years
            new BigDecimal("800.00"),
            new BigDecimal("100000000.00"),
            null, // CTL doesn't pay annual frequency fee
            new BigDecimal("3000.00"), // CTL pays Universal Service Fund
            -17.8292, // Harare, Zimbabwe
            31.0522
        );

        createLicense(
            "NetOne Cellular",
            LicenseType.CTL,
            "customer.care@netone.co.zw",
            LocalDate.of(2019, 7, 20),
            null,
            new BigDecimal("800.00"),
            new BigDecimal("100000000.00"),
            null,
            new BigDecimal("3000.00"),
            -17.8650, // Harare CBD
            31.0450
        );

        createLicense(
            "Telecel Zimbabwe",
            LicenseType.CTL,
            "contact@telecel.co.zw",
            LocalDate.of(2021, 1, 10),
            null,
            new BigDecimal("800.00"),
            new BigDecimal("100000000.00"),
            null,
            new BigDecimal("3000.00"),
            -17.8200, // Harare North
            31.0700
        );

        // Sample PRSL Licenses with Zimbabwe coordinates
        createLicense(
            "ZBC Radio Zimbabwe",
            LicenseType.PRSL,
            "info@zbc.co.zw",
            LocalDate.of(2018, 5, 12),
            10, // PRSL has variable validity
            new BigDecimal("350.00"),
            new BigDecimal("2000000.00"),
            new BigDecimal("2000.00"), // PRSL pays annual frequency fee
            null, // PRSL doesn't pay Universal Service Fund
            -17.8340, // Mbare, Harare
            31.0420
        );

        createLicense(
            "Star FM Zimbabwe",
            LicenseType.PRSL,
            "contact@starfm.co.zw",
            LocalDate.of(2019, 9, 5),
            8,
            new BigDecimal("350.00"),
            new BigDecimal("2000000.00"),
            new BigDecimal("2000.00"),
            null,
            -20.1547, // Bulawayo
            28.5796
        );

        createLicense(
            "Radio 263",
            LicenseType.PRSL,
            "hello@263.co.zw",
            LocalDate.of(2020, 11, 22),
            12,
            new BigDecimal("350.00"),
            new BigDecimal("2000000.00"),
            new BigDecimal("2000.00"),
            null,
            -18.9299, // Mutare
            32.6644
        );

        createLicense(
            "Capitalk FM",
            LicenseType.PRSL,
            "info@capitalkfm.co.zw",
            LocalDate.of(2021, 3, 8),
            10,
            new BigDecimal("350.00"),
            new BigDecimal("2000000.00"),
            new BigDecimal("2000.00"),
            null,
            -17.8700, // Borrowdale, Harare
            31.0800
        );

        createLicense(
            "Diamond FM",
            LicenseType.PRSL,
            "studio@diamondfm.co.zw",
            LocalDate.of(2022, 6, 15),
            7,
            new BigDecimal("350.00"),
            new BigDecimal("2000000.00"),
            new BigDecimal("2000.00"),
            null,
            -17.9800, // Masvingo
            30.8270
        );

        createLicense(
            "Nyaminyami FM",
            LicenseType.PRSL,
            "info@nyaminyami.co.zw",
            LocalDate.of(2023, 2, 20),
            6,
            new BigDecimal("350.00"),
            new BigDecimal("2000000.00"),
            new BigDecimal("2000.00"),
            null,
            -16.5500, // Kariba
            28.8000
        );

        System.out.println("Sample data initialization complete!");
    }

    private void createLicense(String companyName, LicenseType type, String email, 
                               LocalDate issueDate, Integer validityYears,
                               BigDecimal applicationFee, BigDecimal licenseFee,
                               BigDecimal annualFrequencyFee, BigDecimal annualUSC,
                               Double latitude, Double longitude) {
        License license = new License();
        license.setCompanyName(companyName);
        license.setType(type);
        license.setEmail(email);
        license.setIssueDate(issueDate);
        license.setValidityYears(validityYears);
        license.setApplicationFee(applicationFee);
        license.setLicenseFee(licenseFee);
        license.setAnnualFrequencyFee(annualFrequencyFee);
        license.setAnnualUniversalServiceContribution(annualUSC);
        license.setLatitude(latitude);
        license.setLongitude(longitude);
        
        licenseRepository.save(license);
        System.out.println("Created license for: " + companyName);
    }
}
