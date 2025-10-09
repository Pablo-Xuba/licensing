package com.example.licensing.license;

import org.springframework.data.jpa.repository.JpaRepository;//spring data jpa for the license repository

import java.util.Optional;
// this is to extend JPA Repository to provide CRUD operations
public interface LicenseRepository extends JpaRepository<License, Long> {//for the license repository
    Optional<License> findByCompanyName(String companyName);//used to find a license by company name
}
