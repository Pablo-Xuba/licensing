package com.example.licensing.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean //creating users for access rights
    public UserDetailsService userDetailsService() {
        UserDetails taku = User.builder()
            .username("taku")
            .password(passwordEncoder().encode("password"))
            .roles("ADMIN", "MANAGER")
            .build();

        UserDetails guest = User.builder()
                .username("guest")
                .password(passwordEncoder().encode("guest"))
                .roles("VIEWER")
                .build();

        return new InMemoryUserDetailsManager(taku, guest);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/licenses", "/api/licenses/*/years-before-expiry", 
                               "/api/reports/**").permitAll()
                
                // Manager and Admin can : fee adjustments, license comparison, create, update, delete
                .requestMatchers("/api/licenses/*/adjust-fee", "/api/licenses/equals", "/api/licenses", "/api/licenses/*")
                .hasAnyRole("ADMIN", "MANAGER")
                
                // All the users can view
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.realmName("Licensing System"));
        
        return http.build();
    }
}
