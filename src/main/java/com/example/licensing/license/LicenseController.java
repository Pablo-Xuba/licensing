// this licenseController handles all HTTP requests for license operations
package com.example.licensing.license;

import jakarta.validation.Valid; //defines class a full entity
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController//defines the controller
@RequestMapping("/api/licenses")//defines the base URL for the controller
@CrossOrigin(origins = "*")
public class LicenseController {
    // Service layer that contains business logic for licenses
    private final LicenseService service;

    public LicenseController(LicenseService service) {this.service = service;}//injects the service into the controller

    // Get all licenses
    @GetMapping //gets all licenses and returns
    public List<License> all() {return service.all();}

    // Get a single license by its ID
    @GetMapping("/{id}") 
    public License one(@PathVariable Long id) {return service.get(id);}

    @PostMapping //creates a new license
    public ResponseEntity<License> create(@Valid @RequestBody License license) {return ResponseEntity.ok(service.create(license));}

    @PutMapping("/{id}") //updates a license
    public License update(@PathVariable Long id, @Valid @RequestBody License license) {return service.update(id, license);}

    @DeleteMapping("/{id}") //deletes a license by the id
    public ResponseEntity<Void> delete(@PathVariable Long id) {service.delete(id); return ResponseEntity.noContent().build();}

    @GetMapping("/{id}/years-before-expiry") //calculates the number of years before the license expires
    public long years(@PathVariable Long id) {return service.yearsBeforeExpiry(id);}

    @PostMapping("/{id}/adjust-fee") //adjusts the application fee by a given percentage
    public License adjust(@PathVariable Long id, @RequestParam double percentage) {return service.adjustApplicationFee(id, percentage);}

    // Compare two licenses for equality
    @GetMapping("/equals")
    public boolean equals(@RequestParam Long a, @RequestParam Long b) {return service.equals(a,b);}
}
