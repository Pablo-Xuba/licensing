# Licensing Backend (Spring Boot)

Simple REST backend for managing two license types: CTL (Cellular Telecommunications License) and PRSL (Public Radio Station License).

## Features
- CRUD for licenses
- Compute years before expiry (CTL fixed 15 yrs, PRSL custom)
- Adjust application fee by percentage
- Compare two licenses for equality
- Basic scheduled email notification when license within 1 year of expiry (configure SMTP)
- CORS open by default (adjust for production)

## Tech Stack
- Java 17 / Spring Boot
- Spring Web, Data JPA, Validation
- MySQL (switchable) + Hibernate
- Spring Mail (notification)

## Database Setup (MySQL)
Create a database or rely on auto-create:
```
CREATE DATABASE licensing_db CHARACTER SET utf8mb4;
```
Update `src/main/resources/application.properties`:
```
spring.datasource.url=jdbc:mysql://localhost:3306/licensing_db?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_USER
spring.datasource.password=YOUR_PASSWORD
```

For PostgreSQL (example):
```
spring.datasource.url=jdbc:postgresql://localhost:5432/licensing_db
spring.datasource.username=postgres
spring.datasource.password=secret
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```
Add dependency in `pom.xml` if switching DB.

## Build & Run
```
mvn spring-boot:run
```
App runs at `http://localhost:8080`.

## REST Endpoints
Base path: `/api/licenses`

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/licenses | List all |
| GET | /api/licenses/{id} | Get one |
| POST | /api/licenses | Create |
| PUT | /api/licenses/{id} | Update |
| DELETE | /api/licenses/{id} | Delete |
| GET | /api/licenses/{id}/years-before-expiry | Years before expiry |
| POST | /api/licenses/{id}/adjust-fee?percentage=5 | Adjust application fee |
| GET | /api/licenses/equals?a=1&b=2 | Compare equality |

### JSON Model
```
{
  "id": 1,
  "type": "CTL" | "PRSL",
  "companyName": "ABC Telecom",
  "email": "info@abc.com",
  "issueDate": "2025-10-01",
  "validityYears": 10,        // Only for PRSL
  "applicationFee": 800.00,
  "licenseFee": 100000000.00,
  "annualFrequencyFee": 2000.00,  // PRSL only
  "annualUniversalServiceContribution": 3000.00, // CTL only
  "latitude": -17.1234,
  "longitude": 31.1234
}
```

### Standard Values (Pre-populate in Frontend)
CTL: applicationFee=800, licenseFee=100000000, annualUniversalServiceContribution=3000
PRSL: applicationFee=350, licenseFee=2000000, annualFrequencyFee=2000

## Frontend Integration
- Enable CORS: currently `@CrossOrigin("*")` in `LicenseController` (tighten later).
- Frontend (React/Angular/etc) can call endpoints above. Use JSON bodies.
- For maps, frontend can use latitude/longitude to plot markers.
- For reports (pdf/csv/etc) frontend can export using retrieved JSON (not implemented server-side yet for simplicity).

## Adjusting Fees
POST `/api/licenses/{id}/adjust-fee?percentage=5` increases application fee by 5%.

## Expiry Calculation
`years-before-expiry` uses current date. If expired returns 0.

## Email Notifications
Configure SMTP in `application.properties`. For local testing you can run MailHog / fake SMTP:
```
# Example (MailHog)
spring.mail.host=localhost
spring.mail.port=1025
```

## Equality Comparison
`/api/licenses/equals?a=1&b=2` returns true/false based on attribute equality.

## Future Enhancements (Out of Scope Simplified Now)
- Authentication / role-based access
- Report generation service
- GIS heatmaps
- Pagination & filtering
- DTO layer & mappers

## License Types UML (Simplified)
```
+----------------+
|   License      |<<entity>>
+----------------+
| id: Long       |
| type: enum     |
| companyName    |
| email          |
| issueDate      |
| validityYears? |
| applicationFee |
| licenseFee     |
| annualFrequencyFee? |
| annualUniversalServiceContribution? |
| latitude?      |
| longitude?     |
+----------------+
| getExpiryDate()|
| yearsBeforeExpiry() |
| adjustApplicationFee(pct) |
| equals()/hashCode() |
+----------------+
```
Rationale: Single table keeps it simple for frontend consumption.

## Contributing
Keep endpoints backward compatible for frontend team.

