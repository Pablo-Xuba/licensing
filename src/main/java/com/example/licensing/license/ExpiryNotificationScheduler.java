package com.example.licensing.license;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@EnableScheduling
public class ExpiryNotificationScheduler {
    private static final Logger log = LoggerFactory.getLogger(ExpiryNotificationScheduler.class);
    private final LicenseRepository repository;
    private final MailSender mailSender;

    public ExpiryNotificationScheduler(LicenseRepository repository, MailSender mailSender) {
        this.repository = repository;
        this.mailSender = mailSender;
    }

    // Runs daily at 08:00
    @Scheduled(cron = "0 0 8 * * *")
    public void notifyExpiring() {
        LocalDate now = LocalDate.now();
        List<License> all = repository.findAll();
        all.stream()
                .filter(l -> l.yearsBeforeExpiry(now) <= 1) // within a year
                .forEach(this::sendEmail);
    }

    private void sendEmail(License l) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(l.getEmail());
            msg.setSubject("License Expiry Notice");
            msg.setText("Your license expires on " + l.getExpiryDate());
            mailSender.send(msg);
        } catch (Exception e) {
            log.debug("Email sending skipped or failed for {}: {}", l.getEmail(), e.getMessage());
        }
    }
}
