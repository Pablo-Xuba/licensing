package com.example.licensing.license;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/licenses")
@CrossOrigin(origins = "*")
public class LicenseController {
    private final LicenseService service;

    public LicenseController(LicenseService service) {this.service = service;}

    @GetMapping
    public List<License> all() {return service.all();}

    @GetMapping("/{id}")
    public License one(@PathVariable Long id) {return service.get(id);}

    @PostMapping
    public ResponseEntity<License> create(@Valid @RequestBody License license) {return ResponseEntity.ok(service.create(license));}

    @PutMapping("/{id}")
    public License update(@PathVariable Long id, @Valid @RequestBody License license) {return service.update(id, license);}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {service.delete(id); return ResponseEntity.noContent().build();}

    @GetMapping("/{id}/years-before-expiry")
    public long years(@PathVariable Long id) {return service.yearsBeforeExpiry(id);}

    @PostMapping("/{id}/adjust-fee")
    public License adjust(@PathVariable Long id, @RequestParam double percentage) {return service.adjustApplicationFee(id, percentage);}

    @GetMapping("/equals")
    public boolean equals(@RequestParam Long a, @RequestParam Long b) {return service.equals(a,b);}
}
