//backend service and business logic
package com.example.licensing.license;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class LicenseService {
    // The repository that handles database operations for licenses
    private final LicenseRepository repository;

    // Constructor injects the liicense repository dependency
    public LicenseService(LicenseRepository repository) {
        this.repository = repository;
    }

    public List<License> all() {return repository.findAll();}

    // Get a single license by its ID
    public License get(Long id) {return repository.findById(id).orElseThrow();}

    public License create(License l) {return repository.save(l);}

    // Update an existing license with new data
    public License update(Long id, License updated) {
        License existing = get(id);
        existing.setType(updated.getType());
        existing.setCompanyName(updated.getCompanyName());
        existing.setEmail(updated.getEmail());
        existing.setIssueDate(updated.getIssueDate());
        existing.setValidityYears(updated.getValidityYears());
        existing.setApplicationFee(updated.getApplicationFee());
        existing.setLicenseFee(updated.getLicenseFee());
        existing.setAnnualFrequencyFee(updated.getAnnualFrequencyFee());
        existing.setAnnualUniversalServiceContribution(updated.getAnnualUniversalServiceContribution());
        existing.setLatitude(updated.getLatitude());
        existing.setLongitude(updated.getLongitude());
        return existing;//this returns the updated license
    }

    
    public void delete(Long id) {repository.deleteById(id);}// deleting a license by its ID

   
    public long yearsBeforeExpiry(Long id) {return get(id).yearsBeforeExpiry(LocalDate.now());} // to calculate years before a license expires

    public License adjustApplicationFee(Long id, double percentage) {
        License l = get(id);
        l.adjustApplicationFee(percentage);
        return l;
    }

    // Compare two licenses for equality
    public boolean equals(Long id1, Long id2) {
        return get(id1).equals(get(id2));
    }
}
