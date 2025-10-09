package com.example.licensing.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class AuthController {

    @GetMapping("/current")
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        Map<String, Object> userInfo = new HashMap<>();
        
        if (authentication != null && authentication.isAuthenticated()) {
            userInfo.put("username", authentication.getName());
            userInfo.put("authenticated", true);
            
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            userInfo.put("roles", authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));
        } else {
            userInfo.put("authenticated", false);
        }
        
        return userInfo;
    }
}
