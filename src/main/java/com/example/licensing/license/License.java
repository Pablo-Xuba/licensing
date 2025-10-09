package com.example.licensing.license;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;//this is a validation library

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
//BACKEND data model storing details about a license
@Entity
@Table(name = "licenses") // Maps this class to the 'licenses' table in the database
public class License {
    // Unique ID for each license
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // to see either the type of license: CTL or PRSL
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private LicenseType type;

    // Name of the licensed company
    @NotBlank
    @Column(nullable = false, unique = true)
    private String companyName;

    // Contact email for the company
    @Email
    @NotBlank
    @Column(nullable = false)
    private String email;

    // Date when the license was issued
    @NotNull
    private LocalDate issueDate;

    // Stored validity years (for PRSL) or computed fixed 15 for CTL
    private Integer validityYears; // null for CTL optional

    // Financial fields
    @Digits(integer = 15, fraction = 2)
    private BigDecimal applicationFee;

    @Digits(integer = 15, fraction = 2)
    private BigDecimal licenseFee;

    @Digits(integer = 15, fraction = 2)
    private BigDecimal annualFrequencyFee; // PRSL only

    @Digits(integer = 15, fraction = 2)
    private BigDecimal annualUniversalServiceContribution; // CTL only

    // GPS coordinates for the company location
    private Double latitude;
    private Double longitude;

    public License() { /* JPA requires a noargument constructor */ }

    // Getters & Setters
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
    public LicenseType getType() {return type;}
    public void setType(LicenseType type) {this.type = type;}
    public String getCompanyName() {return companyName;}
    public void setCompanyName(String companyName) {this.companyName = companyName;}
    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}
    public LocalDate getIssueDate() {return issueDate;}
    public void setIssueDate(LocalDate issueDate) {this.issueDate = issueDate;}
    public Integer getValidityYears() {return validityYears;}
    public void setValidityYears(Integer validityYears) {this.validityYears = validityYears;}
    public BigDecimal getApplicationFee() {return applicationFee;}
    public void setApplicationFee(BigDecimal applicationFee) {this.applicationFee = applicationFee;}
    public BigDecimal getLicenseFee() {return licenseFee;}
    public void setLicenseFee(BigDecimal licenseFee) {this.licenseFee = licenseFee;}
    public BigDecimal getAnnualFrequencyFee() {return annualFrequencyFee;}
    public void setAnnualFrequencyFee(BigDecimal annualFrequencyFee) {this.annualFrequencyFee = annualFrequencyFee;}
    public BigDecimal getAnnualUniversalServiceContribution() {return annualUniversalServiceContribution;}
    public void setAnnualUniversalServiceContribution(BigDecimal annualUniversalServiceContribution) {this.annualUniversalServiceContribution = annualUniversalServiceContribution;}
    public Double getLatitude() {return latitude;}
    public void setLatitude(Double latitude) {this.latitude = latitude;}
    public Double getLongitude() {return longitude;}
    public void setLongitude(Double longitude) {this.longitude = longitude;}

    
    public long yearsBeforeExpiry(LocalDate asOf) {// to clculate how many years before this license expires
        LocalDate expiry = getExpiryDate();
        if (asOf.isAfter(expiry)) return 0;
        return ChronoUnit.YEARS.between(asOf, expiry);
    }

    
    public LocalDate getExpiryDate() {//getting the expiry date for this license 
        int years;
        if (type == LicenseType.CTL) {
            years = 15;
        } else {
            years = (validityYears != null ? validityYears : 0);
        }
        return issueDate.plusYears(years);
    }

    // Adjust the application fee by a percentage
    public void adjustApplicationFee(double percentage) {
        if (applicationFee == null) return;
        BigDecimal factor = BigDecimal.valueOf(1 + (percentage / 100d));
        applicationFee = applicationFee.multiply(factor).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof License other)) return false;
        return Objects.equals(type, other.type) &&
                Objects.equals(companyName, other.companyName) &&
                Objects.equals(issueDate, other.issueDate) &&
                Objects.equals(latitude, other.latitude) &&
                Objects.equals(longitude, other.longitude) &&
                Objects.equals(validityYears, other.validityYears) &&
                Objects.equals(applicationFee, other.applicationFee) &&
                Objects.equals(licenseFee, other.licenseFee) &&
                Objects.equals(annualFrequencyFee, other.annualFrequencyFee) &&
                Objects.equals(annualUniversalServiceContribution, other.annualUniversalServiceContribution);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, companyName, issueDate, latitude, longitude, validityYears,
                applicationFee, licenseFee, annualFrequencyFee, annualUniversalServiceContribution);
    }
}
