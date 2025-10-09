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

    @Bean
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

        UserDetails briel = User.builder()
                .username("briel")
                .password(passwordEncoder().encode("password"))
                .roles("ADMIN", "MANAGER")
                .build();

        UserDetails ethel = User.builder()
                .username("ethel")
                .password(passwordEncoder().encode("password"))
                .roles("ADMIN", "MANAGER")
                .build();

        UserDetails charity = User.builder()
                .username("charity")
                .password(passwordEncoder().encode("password"))
                .roles("ADMIN", "MANAGER")
                .build();

        UserDetails leon = User.builder()
                .username("leon")
                .password(passwordEncoder().encode("password"))
                .roles("ADMIN", "MANAGER")
                .build();

        return new InMemoryUserDetailsManager(taku, guest, briel, ethel, charity, leon);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/licenses", "/api/licenses/*/years-before-expiry", 
                               "/api/reports/**").permitAll()
                
                // User info endpoint
                .requestMatchers("/api/user/current").authenticated()
                
                // Manager and Admin - fee adjustments, license comparison, create, update, delete
                .requestMatchers("/api/licenses/*/adjust-fee", "/api/licenses/equals", "/api/licenses", "/api/licenses/*")
                .hasAnyRole("ADMIN", "MANAGER")
                
                // All authenticated users can view
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.realmName("Licensing System"));
        
        return http.build();
    }
}
